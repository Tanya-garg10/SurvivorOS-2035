"use client";

import { motion } from "framer-motion";

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}

export default function StatBar({ label, value, color, icon }: StatBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[10px] font-orbitron tracking-widest uppercase font-bold">
        <span className="flex items-center gap-1">
          {icon} {label}
        </span>
        <span className={color}>{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-900 border border-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`}
          style={{ backgroundColor: color.includes('cyan') ? '#22d3ee' : color.includes('purple') ? '#a855f7' : color.includes('pink') ? '#f472b6' : color.includes('amber') ? '#fbbf24' : '#f87171' }}
        />
      </div>
    </div>
  );
}
