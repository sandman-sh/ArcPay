"use client";

import React from "react";
import { motion } from "framer-motion";
import { Settings, Zap, Shield } from "lucide-react";

interface HeaderProps {
  onOpenRules: () => void;
  activeTab: "dashboard" | "chat";
  onTabChange: (tab: "dashboard" | "chat") => void;
}

export default function Header({ onOpenRules, activeTab, onTabChange }: HeaderProps) {
  return (
    <motion.header
      className="glass-card px-6 py-4 flex items-center justify-between"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center shadow-glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent-emerald border-2 border-surface-1" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            Arc<span className="gradient-text">Pay</span>
          </h1>
          <div className="flex items-center gap-1.5">
            <div className="status-dot" />
            <span className="text-[11px] text-slate-400 font-mono">
              0x8F9a...3B1c · Arc Testnet
            </span>
          </div>
        </div>
      </div>

      {/* Center — Network badge */}
      <div className="hidden md:flex items-center gap-2 bg-surface-2/80 border border-surface-3 rounded-full px-4 py-1.5">
        <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
        <span className="text-xs font-medium text-slate-300">Arc Testnet</span>
        <span className="text-[10px] text-slate-500 font-mono">ID: 5042002</span>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-3">
        <button onClick={onOpenRules} className="btn-ghost flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Rules</span>
        </button>
        <button onClick={onOpenRules} className="btn-ghost flex items-center gap-2">
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </motion.header>
  );
}
