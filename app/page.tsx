"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "@/components/Dashboard";
import ChatInterface from "@/components/ChatInterface";
import TxTable from "@/components/TxTable";
import RulesModal from "@/components/RulesModal";
import Header from "@/components/Header";

export default function ArcPayHome() {
  const [balance, setBalance] = useState(0.0);
  const [dailySpent, setDailySpent] = useState(4.5);
  const [rules, setRules] = useState([
    { id: 1, text: "Daily spending cap is $50" },
    { id: 2, text: "Auto-pay coffee up to $5" },
    { id: 3, text: "Reject all entertainment expenses" },
  ]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "chat">("dashboard");

  useEffect(() => {
    const savedTxs = localStorage.getItem("arcpay_txs");
    const savedSpent = localStorage.getItem("arcpay_spent");
    const savedRules = localStorage.getItem("arcpay_rules");
    
    if (savedTxs) {
      try { setTransactions(JSON.parse(savedTxs)); } catch(e){}
    }
    if (savedSpent) {
      setDailySpent(parseFloat(savedSpent));
    }
    if (savedRules) {
      try { setRules(JSON.parse(savedRules)); } catch(e){}
    }
  }, []);

  useEffect(() => {
    if (transactions.length > 0) localStorage.setItem("arcpay_txs", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (dailySpent !== 4.5) localStorage.setItem("arcpay_spent", dailySpent.toString());
  }, [dailySpent]);

  useEffect(() => {
    localStorage.setItem("arcpay_rules", JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch("/api/balance");
        const data = await res.json();
        if (data.success && data.balance) {
          setBalance(parseFloat(data.balance));
        }
      } catch (err) {
        console.error("Failed to fetch balance", err);
      }
    }
    fetchBalance();
  }, []);

  const handleNewTx = (tx: any) => {
    setTransactions((prev) => [tx, ...prev]);
    setBalance((prev) => Math.max(0, prev - tx.amount));
    setDailySpent((prev) => prev + tx.amount);
  };

  const handleBulkTx = (txs: any[]) => {
    setTransactions((prev) => [...txs, ...prev]);
    const total = txs.reduce((sum, tx) => sum + tx.amount, 0);
    setBalance((prev) => Math.max(0, prev - total));
    setDailySpent((prev) => prev + total);
  };

  return (
    <div className="h-screen max-h-screen max-w-[1400px] mx-auto px-4 md:px-8 py-6 flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header
          onOpenRules={() => setIsRulesModalOpen(true)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="mt-6 flex-1 min-h-0 grid gap-6 lg:grid-cols-5">
        {/* Left — Dashboard + Tx */}
        <motion.div
          className="lg:col-span-3 flex flex-col space-y-6 min-h-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex-shrink-0">
            <Dashboard
              balance={balance}
              dailySpent={dailySpent}
              txCount={transactions.length}
              onBulkTx={handleBulkTx}
            />
          </div>
          <div className="flex-1 min-h-0">
            <TxTable transactions={transactions} />
          </div>
        </motion.div>

        {/* Right — Chat */}
        <motion.div
          className="lg:col-span-2 flex flex-col min-h-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        >
          <ChatInterface
            rules={rules}
            dailySpent={dailySpent}
            onNewPayment={handleNewTx}
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {isRulesModalOpen && (
          <RulesModal
            rules={rules}
            setRules={setRules}
            onClose={() => setIsRulesModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
