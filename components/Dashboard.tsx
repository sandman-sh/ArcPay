"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  CheckCircle2,
  Zap,
  TrendingDown,
  Activity,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

interface DashboardProps {
  balance: number;
  dailySpent: number;
  txCount: number;
  onBulkTx: (txs: any[]) => void;
}

export default function Dashboard({ balance, dailySpent, txCount, onBulkTx }: DashboardProps) {
  const [isLooping, setIsLooping] = useState(false);
  const [loopProgress, setLoopProgress] = useState(0);

  const runBatchProcess = async () => {
    setIsLooping(true);
    setLoopProgress(0);
    try {
      const res = await fetch("/api/loop", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        // Animate them in progressively
        const batchSize = 10;
        for (let i = 0; i < data.txs.length; i += batchSize) {
          const batch = data.txs.slice(i, i + batchSize);
          onBulkTx(batch);
          setLoopProgress(Math.min(100, ((i + batchSize) / data.txs.length) * 100));
          await new Promise((r) => setTimeout(r, 120));
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoopProgress(100);
    setTimeout(() => {
      setIsLooping(false);
      setLoopProgress(0);
    }, 600);
  };

  const dailyCap = 50;
  const spentPercent = Math.min(100, (dailySpent / dailyCap) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Balance Card */}
      <motion.div
        className="glass-card noise relative p-6 overflow-hidden md:col-span-1"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Decorative orb */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-blue/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent-cyan/8 rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-accent-indigo" />
            </div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Available Balance
            </span>
          </div>

          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-sm text-slate-400 font-medium">$</span>
            <span className="text-4xl font-bold text-white tracking-tight">
              {balance.toFixed(2)}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">USDC on Arc Testnet</span>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-accent-emerald bg-accent-emerald/10 px-2.5 py-1 rounded-full font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Funded
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daily Spent Card */}
      <motion.div
        className="glass-card noise relative p-6 overflow-hidden md:col-span-1"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent-rose/8 rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent-rose/10 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-accent-rose" />
            </div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Daily Spent
            </span>
          </div>

          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-sm text-slate-400 font-medium">$</span>
            <span className="text-3xl font-bold text-white tracking-tight">
              {dailySpent.toFixed(2)}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">of ${dailyCap} daily cap</span>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-surface-3 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  spentPercent > 80
                    ? "linear-gradient(90deg, #fb7185, #f43f5e)"
                    : spentPercent > 50
                    ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                    : "linear-gradient(90deg, #34d399, #10b981)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${spentPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Batch Process Card */}
      <motion.div
        className="glass-card noise relative p-6 overflow-hidden md:col-span-1"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent-cyan/8 rounded-full blur-2xl" />

        <div className="relative flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-accent-cyan" />
              </div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Batch Processor
              </span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-3">
              Process 60 simultaneous x402 nano-payments on Arc to prove real per-action pricing is ≤ $0.01.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              {txCount} txs completed
            </div>
          </div>

          <button
            onClick={runBatchProcess}
            disabled={isLooping}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3"
          >
            {isLooping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing... {Math.round(loopProgress)}%</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Process Batch Transactions</span>
              </>
            )}
          </button>

          {/* Loop progress bar */}
          {isLooping && (
            <div className="mt-3 h-1 bg-surface-3 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan"
                animate={{ width: `${loopProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
