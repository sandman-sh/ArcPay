"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Trash2, Plus, Shield, Sparkles } from "lucide-react";

const EXAMPLE_RULES = [
  "Allow subscriptions up to $15/month",
  "Block all gambling transactions",
  "Auto-pay food under $10",
  "Require approval for anything over $20",
  "Only allow crypto purchases on weekdays",
];

export default function RulesModal({ rules, setRules, onClose }: any) {
  const [newRule, setNewRule] = useState("");

  const addRule = () => {
    if (!newRule.trim()) return;
    setRules([...rules, { id: Date.now(), text: newRule }]);
    setNewRule("");
  };

  const removeRule = (id: number) => {
    setRules(rules.filter((r: any) => r.id !== id));
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="glass-card relative w-full max-w-lg overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 flex items-center justify-center border border-accent-blue/20">
              <Shield className="w-4 h-4 text-accent-indigo" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Spending Rules</h2>
              <p className="text-[11px] text-slate-500">
                Natural language guardrails for your AI agent
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-2 hover:bg-surface-3 border border-surface-3 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Rules List */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Active Rules */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Rules ({rules.length})
            </span>
            {rules.map((rule: any, i: number) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between bg-surface-2/60 border border-surface-3 p-3.5 rounded-xl group hover:border-accent-blue/20 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald flex-shrink-0" />
                  <span className="text-[13px] text-slate-200">{rule.text}</span>
                </div>
                <button
                  onClick={() => removeRule(rule.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-accent-rose p-1.5 rounded-lg hover:bg-accent-rose/10 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Add Rule */}
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Add New Rule
            </span>
            <div className="flex gap-2">
              <input
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRule()}
                placeholder="Describe a spending rule..."
                className="flex-1 bg-surface-2/60 border border-surface-3 rounded-xl px-4 py-3 text-[13px] text-white placeholder-slate-500 transition-all focus:border-accent-blue/30"
              />
              <button
                onClick={addRule}
                disabled={!newRule.trim()}
                className="btn-primary !px-4 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-accent-amber" />
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Suggestions
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_RULES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setNewRule(ex)}
                  className="text-[11px] text-slate-400 bg-surface-2/40 border border-surface-3 px-3 py-1.5 rounded-lg hover:border-accent-blue/20 hover:text-slate-300 transition-all"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
