"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Bot, Sparkles, CheckCircle, XCircle, AlertCircle, Trash2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  status?: "pay" | "reject" | "approve" | "message";
  amount?: number;
  txUrl?: string;
}

export default function ChatInterface({ rules, dailySpent, onNewPayment }: any) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "agent",
      content: "Hey! I'm your ArcPay agent. Tell me what you'd like to pay for, and I'll handle it securely. Try: \"Pay $3 for coffee\" or \"Buy $0.50 weather data\".",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("arcpay_chat");
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch(e){}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("arcpay_chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const clearChat = () => {
    const defaultMsg: Message[] = [{
      id: "welcome",
      role: "agent",
      content: "Hey! I'm your ArcPay agent. Tell me what you'd like to pay for, and I'll handle it securely. Try: \"Pay $3 for coffee\" or \"Buy $0.50 weather data\".",
    }];
    setMessages(defaultMsg);
    localStorage.setItem("arcpay_chat", JSON.stringify(defaultMsg));
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    const msgId = Date.now().toString();

    setMessages((prev) => [
      ...prev,
      { id: msgId, role: "user", content: userMsg },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, rules, dailySpent }),
      });
      const data = await res.json();
      const decision = data.decision;

      let agentReply = "";
      let status: "pay" | "reject" | "approve" | "message" = decision.action;
      let txUrl: string | undefined;

      if (decision.action === "pay") {
        agentReply = `✅ Approved — $${decision.amountInUSDC} USDC\n${decision.reason}`;

        const payRes = await fetch("/api/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: decision.amountInUSDC,
            recipient: decision.merchant || "0xArc...",
            reason: decision.reason,
          }),
        });
        const payData = await payRes.json();

        if (payData.success) {
          agentReply += `\n\n🔗 Tx confirmed on Arc Testnet`;
          txUrl = payData.tx.explorerUrl;
          onNewPayment({
            id: payData.tx.txHash,
            amount: decision.amountInUSDC,
            merchant: decision.merchant || "Unknown",
            hash: payData.tx.txHash,
            url: payData.tx.explorerUrl,
            time: new Date().toISOString(),
          });
        }
      } else if (decision.action === "reject") {
        agentReply = `🚫 Rejected\n${decision.reason}`;
      } else if (decision.action === "message") {
        agentReply = `💬 ${decision.reason}`;
      } else {
        agentReply = `⏳ Needs Approval — $${decision.amountInUSDC} USDC\n${decision.reason}`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          role: "agent",
          content: agentReply,
          status,
          amount: decision.amountInUSDC,
          txUrl,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "agent",
          content: "⚠️ Network error — please try again.",
          status: "reject",
        },
      ]);
    }
    setLoading(false);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "pay":
        return <CheckCircle className="w-3.5 h-3.5 text-accent-emerald" />;
      case "reject":
        return <XCircle className="w-3.5 h-3.5 text-accent-rose" />;
      case "approve":
        return <AlertCircle className="w-3.5 h-3.5 text-accent-amber" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "pay":
        return "border-accent-emerald/20";
      case "reject":
        return "border-accent-rose/20";
      case "approve":
        return "border-accent-amber/20";
      default:
        return "border-surface-3";
    }
  };

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden relative shadow-2xl">
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-accent-blue/5 to-transparent pointer-events-none" />
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 flex items-center justify-center border border-accent-blue/20 shadow-glow-cyan">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 status-dot" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm tracking-wide">ArcPay Agent</h3>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              OpenRouter AI · x402 Protocol
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-mono text-slate-600 bg-surface-2 px-2 py-1 rounded-md border border-surface-3">
            {messages.length - 1} msgs
          </div>
          <button 
            onClick={clearChat} 
            title="Clear Chat"
            className="p-1.5 text-slate-500 hover:text-accent-rose bg-surface-2 hover:bg-accent-rose/10 rounded-md border border-surface-3 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-accent-blue to-accent-blue/80 text-white rounded-br-md shadow-glow"
                    : `bg-surface-2/80 text-slate-200 rounded-bl-md border ${getStatusColor(m.status)}`
                }`}
              >
                {m.role === "agent" && m.status && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {getStatusIcon(m.status)}
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {m.status === "pay" ? "Payment Sent" : m.status === "reject" ? "Rejected" : "Pending"}
                    </span>
                  </div>
                )}
                <p className="text-[13px] whitespace-pre-wrap leading-relaxed">
                  {m.content}
                </p>
                {m.txUrl && (
                  <a
                    href={m.txUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                  >
                    View on Arcscan →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-surface-2/80 border border-surface-3 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-accent-indigo" />
                <span className="text-xs text-slate-400">Processing...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-surface-1/50 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-full p-1.5 pl-4 transition-all focus-within:border-accent-blue/50 focus-within:shadow-glow-cyan">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="What would you like to pay for?"
            className="flex-1 bg-transparent text-white text-sm py-2 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="btn-primary !p-3 !rounded-full flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-3 text-center font-medium tracking-wide">
          Powered by OpenRouter · Circle x402 · Arc Testnet
        </p>
      </div>
    </div>
  );
}
