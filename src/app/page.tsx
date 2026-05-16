"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Terminal, Shield, Zap, Activity } from "lucide-react";

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [bootText, setBootText] = useState<string[]>([]);
  
  const bootLines = [
    "> INITIALIZING SURVIVOR_OS v4.0.2",
    "> LOADING NEURAL NETWORK ARCHITECTURE...",
    "> ESTABLISHING QUANTUM LINK TO 2035...",
    "> DEPLOYING CYBER-SURVIVAL PROTOCOLS...",
    "> SCANNING BIOMETRIC SIGNATURE...",
    "> ACCESS GRANTED.",
    "> WELCOME TO THE FUTURE."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootLines.length) {
        setBootText(prev => [...prev, bootLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 1000);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <AnimatePresence>
        {booting && (
          <motion.div 
            key="boot"
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-6 font-mono"
          >
            <div className="w-full max-w-lg text-left space-y-2">
              {bootText.map((line, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  key={i} 
                  className={i === bootLines.length - 1 ? "text-neon-cyan font-bold" : "text-slate-500"}
                >
                  {line}
                </motion.div>
              ))}
              <motion.div 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-5 bg-neon-cyan ml-1 align-middle"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-neon-cyan/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-neon-purple/10 blur-[120px] animate-pulse-glow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl space-y-8"
      >
        <div className="space-y-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block px-4 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-sm font-rajdhani font-semibold tracking-widest uppercase mb-4"
          >
            System Status: Operational
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-orbitron font-bold tracking-tighter text-white neon-text-cyan">
            SURVIVOR<span className="text-neon-purple">OS</span> 2035
          </h1>
          
          <p className="text-xl md:text-2xl font-rajdhani text-slate-400 max-w-2xl mx-auto">
            The year is 2035. Artificial Intelligence has redefined humanity. 
            <span className="block mt-2 text-neon-pink font-bold">Adapt or Disappear.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-12">
          {[
            { icon: Terminal, label: "AI Disruption", color: "text-neon-cyan" },
            { icon: Shield, label: "Cyber Warfare", color: "text-neon-purple" },
            { icon: Zap, label: "Automation", color: "text-neon-pink" },
            { icon: Activity, label: "Social Stability", color: "text-neon-amber" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass p-4 rounded-xl flex flex-col items-center space-y-2"
            >
              <item.icon className={`h-6 w-6 ${item.color}`} />
              <span className="text-xs font-rajdhani uppercase tracking-widest text-slate-300">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/setup">
            <button className="group relative px-8 py-4 font-orbitron font-bold text-lg tracking-widest text-white transition-all duration-300">
              <div className="absolute inset-0 bg-neon-cyan/20 group-hover:bg-neon-cyan/30 transition-colors" />
              <div className="absolute inset-0 border-2 border-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.8)]" />
              <span className="relative flex items-center gap-2">
                INITIALIZE SIMULATION <Zap className="h-5 w-5 fill-neon-cyan" />
              </span>
            </button>
          </Link>
        </motion.div>

        <div className="pt-12 text-slate-500 font-rajdhani text-sm uppercase tracking-widest animate-pulse">
          Establishing neural link... 2035 projection active
        </div>
      </motion.div>
    </main>
  );
}

