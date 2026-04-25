"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowDownRight, Receipt } from "lucide-react";

export default function TxTable({ transactions }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-surface-2 border border-surface-3 flex items-center justify-center mb-3">
          <Receipt className="w-5 h-5 text-slate-500" />
        </div>
        <p className="text-sm text-slate-400 font-medium">No transactions yet</p>
        <p className="text-xs text-slate-600 mt-1">Send a payment or execute a batch process to see transactions here.</p>
      </div>
    );
  }

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-white text-sm">Transaction History</h2>
          <span className="text-[10px] font-mono text-slate-500 bg-surface-2 px-2 py-0.5 rounded-md border border-surface-3">
            {transactions.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Merchant
              </th>
              <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                Tx Hash
              </th>
              <th className="px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">
                Explorer
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {transactions.slice(0, 50).map((tx, i) => (
                <motion.tr
                  key={tx.id || i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  className="tx-row border-b border-white/[0.03]"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-accent-rose/10 flex items-center justify-center flex-shrink-0">
                        <ArrowDownRight className="w-3.5 h-3.5 text-accent-rose" />
                      </div>
                      <span className="font-medium text-slate-200 text-[13px]">
                        {tx.merchant}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-accent-rose font-mono text-[13px] font-medium">
                      -${(tx.amount || 0).toFixed(3)}
                    </span>
                  </td>
                  <td className="px-6 py-3 hidden md:table-cell">
                    <span className="font-mono text-[11px] text-slate-600">
                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-4)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <a
                      href={tx.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-accent-indigo hover:text-accent-blue bg-accent-blue/5 hover:bg-accent-blue/10 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {transactions.length > 50 && (
        <div className="px-6 py-3 border-t border-white/5 text-center">
          <span className="text-[11px] text-slate-500">
            Showing 50 of {transactions.length} transactions
          </span>
        </div>
      )}
    </div>
  );
}
