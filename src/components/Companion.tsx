"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function Companion({ stats, scenario }: { stats: any, scenario: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tip, setTip] = useState("");

  useEffect(() => {
    if (scenario) {
      const tips = [
        "Your adaptability is low. Consider choices that challenge the status quo.",
        "AI dependency is rising. You're becoming a part of the machine.",
        "Mental health is critical. Prioritize stability over profit.",
        "The risk level is " + scenario.riskLevel + ". Be cautious.",
      ];
      setTip(tips[Math.floor(Math.random() * tips.length)]);
    }
  }, [scenario]);

  return (
    <div className="fixed bottom-20 right-8 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-64 glass p-4 rounded-2xl border border-neon-cyan/50 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-orbitron text-neon-cyan uppercase flex items-center gap-1">
                <Sparkles size={10} /> AI Companion
              </span>
              <button onClick={() => setIsOpen(false)}><X size={14} className="text-slate-500" /></button>
            </div>
            <p className="font-rajdhani text-sm text-slate-200 italic leading-relaxed">
              "{tip}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-neon-cyan/20 border border-neon-cyan flex items-center justify-center text-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.5)]"
      >
        <Bot size={28} className={isOpen ? "animate-pulse" : ""} />
      </motion.button>
    </div>
  );
}
