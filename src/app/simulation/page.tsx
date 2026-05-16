"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Coins, Brain, ShieldAlert, Cpu, TrendingUp, 
  Loader2, AlertTriangle, ChevronRight, RefreshCcw, User, Volume2
} from "lucide-react";
import StatBar from "@/components/StatBar";
import Companion from "@/components/Companion";
import CareerMeter from "@/components/CareerMeter";
import SocialFeed from "@/components/SocialFeed";
import { Scenario, UserProfile, SurvivalStats } from "@/lib/ai";
import Link from "next/link";

export default function SimulationPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<SurvivalStats>({
    money: 100,
    mentalHealth: 100,
    careerSafety: 100,
    aiDependency: 20,
    adaptability: 50,
  });
  
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [outcome, setOutcome] = useState<{ text: string; impact: Partial<SurvivalStats> } | null>(null);
  const [history, setHistory] = useState<{ title: string; choice: string }[]>([]);
  const [personality, setPersonality] = useState("Initializing...");
  const [survivalChance, setSurvivalChance] = useState(100);
  const [ending, setEnding] = useState<any>(null);
  const [endingLoading, setEndingLoading] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (!savedProfile) {
      router.push("/setup");
      return;
    }
    const parsedProfile = JSON.parse(savedProfile);
    setProfile(parsedProfile);
    fetchScenario(parsedProfile, stats, []);
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.onstart = () => setIsNarrating(true);
      utterance.onend = () => setIsNarrating(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const fetchScenario = async (userProfile: UserProfile, currentStats: SurvivalStats, pastDecisions: string[]) => {
    setLoading(true);
    setOutcome(null);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          profile: userProfile, 
          stats: currentStats,
          history: pastDecisions
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setScenario(data);
      if (data.personalityUpdate) setPersonality(data.personalityUpdate);
      if (data.survivalProbability !== undefined) setSurvivalChance(data.survivalProbability);
      // Auto-narrate
      setTimeout(() => speak(data.description), 1000);
    } catch (error) {
      console.error("Failed to fetch scenario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = (choice: Scenario["choices"][0]) => {
    if (!scenario) return;
    
    window.speechSynthesis.cancel();
    const newHistory = [{ title: scenario.title, choice: choice.text }, ...history].slice(0, 5);
    setHistory(newHistory);
    
    setOutcome({
      text: choice.consequence,
      impact: choice.impact
    });
    
    setStats(prev => ({
      money: Math.max(0, Math.min(100, prev.money + (choice.impact.money || 0))),
      mentalHealth: Math.max(0, Math.min(100, prev.mentalHealth + (choice.impact.mentalHealth || 0))),
      careerSafety: Math.max(0, Math.min(100, prev.careerSafety + (choice.impact.careerSafety || 0))),
      aiDependency: Math.max(0, Math.min(100, prev.aiDependency + (choice.impact.aiDependency || 0))),
      adaptability: Math.max(0, Math.min(100, prev.adaptability + (choice.impact.adaptability || 0))),
    }));
  };

  const handleEndSimulation = async () => {
    setEndingLoading(true);
    try {
      const res = await fetch("/api/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          profile, 
          stats,
          history: history.map(h => `${h.title}: ${h.choice}`)
        }),
      });
      const data = await res.json();
      setEnding(data);
    } catch (error) {
      console.error("End Sim Error:", error);
    } finally {
      setEndingLoading(false);
    }
  };

  const nextScenario = () => {
    if (profile) fetchScenario(profile, stats, history.map(h => h.choice));
  };

  const resetSimulation = () => {
    if (confirm("Reset simulation memory? All progress will be lost.")) {
      window.location.reload();
    }
  };

  if (!profile) return null;

  return (
    <main className={`min-h-screen p-4 md:p-8 flex flex-col gap-6 flicker relative transition-colors duration-1000 ${
      scenario?.riskLevel === 'Critical' ? 'bg-red-950/20' : 
      scenario?.riskLevel === 'High' ? 'bg-orange-950/20' : 
      'bg-slate-950'
    }`}>
      <Companion stats={stats} scenario={scenario} />
      
      <AnimatePresence>
        {ending && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="max-w-3xl w-full glass p-12 rounded-3xl border border-neon-cyan/30 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
               <div className="space-y-2">
                 <h2 className="text-neon-cyan font-orbitron text-xs tracking-[0.5em] uppercase">Simulation Complete</h2>
                 <h1 className="text-5xl font-orbitron font-bold text-white tracking-tighter">{ending.title}</h1>
               </div>
               <p className="text-2xl font-rajdhani text-slate-300 italic">"{ending.description}"</p>
               <div className="glass p-6 bg-white/5 rounded-xl border border-white/5 font-rajdhani text-lg leading-relaxed text-slate-400">
                 {ending.ending}
               </div>
               <div className="space-y-4">
                 <h4 className="font-orbitron text-[10px] text-neon-purple uppercase tracking-[0.3em]">Future Skills to Acquire</h4>
                 <div className="flex flex-wrap gap-2">
                   {ending.skillsToLearn?.map((s: string) => (
                     <span key={s} className="px-3 py-1 bg-neon-purple/20 border border-neon-purple/30 text-neon-purple text-xs font-rajdhani uppercase rounded-full">
                       {s}
                     </span>
                   ))}
                 </div>
               </div>
               <button 
                 onClick={() => window.location.href = "/"}
                 className="w-full py-4 bg-neon-cyan text-black font-orbitron font-bold uppercase tracking-widest hover:bg-white transition-colors"
               >
                 Acknowledge & Terminate
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex justify-between items-center glass p-4 rounded-xl border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-neon-cyan/20 border border-neon-cyan flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            <User className="text-neon-cyan h-5 w-5" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-sm text-white uppercase tracking-wider">{profile.name}</h3>
            <p className="font-rajdhani text-xs text-neon-cyan uppercase tracking-tighter animate-pulse-glow">Archetype: {personality}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] font-orbitron text-slate-500 uppercase">Survival Prob.</span>
            <span className={`text-sm font-orbitron ${survivalChance < 30 ? 'text-neon-red' : 'text-neon-cyan'} neon-text-cyan`}>{survivalChance}%</span>
          </div>
          <button onClick={handleEndSimulation} className="px-4 py-1.5 border border-neon-red/30 bg-neon-red/10 text-neon-red text-[10px] font-orbitron uppercase tracking-widest hover:bg-neon-red hover:text-white transition-all">
             End Sim
          </button>
          <button onClick={resetSimulation} className="text-slate-500 hover:text-neon-red transition-all">
             <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1">
        {/* Left Panel: Stats */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl border border-white/10 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan/30" />
            <h4 className="font-orbitron font-bold text-xs text-slate-400 uppercase tracking-[0.2em] border-b border-white/5 pb-2 flex justify-between items-center">
              Metrics <span>v4.0</span>
            </h4>
            
            <StatBar label="Financial Health" value={stats.money} color="text-neon-cyan" icon={<Coins size={14} />} />
            <StatBar label="Mental Stability" value={stats.mentalHealth} color="text-neon-pink" icon={<Brain size={14} />} />
            <StatBar label="Career Integrity" value={stats.careerSafety} color="text-neon-purple" icon={<ShieldAlert size={14} />} />
            <StatBar label="AI Dependency" value={stats.aiDependency} color="text-neon-amber" icon={<Cpu size={14} />} />
            <StatBar label="Adaptability" value={stats.adaptability} color="text-neon-cyan" icon={<TrendingUp size={14} />} />
            
            {/* Survival Meter */}
            <div className="pt-6 border-t border-white/5">
              <div className="flex justify-between text-[10px] font-orbitron text-slate-500 uppercase tracking-widest mb-2">
                 <span>Overall Stability</span>
                 <span>{survivalChance}%</span>
              </div>
              <div className="h-4 w-full bg-slate-900 rounded-full border border-white/5 p-0.5 overflow-hidden">
                 <motion.div 
                   animate={{ width: `${survivalChance}%` }}
                   className={`h-full rounded-full ${survivalChance < 30 ? 'bg-neon-red shadow-[0_0_10px_#ef4444]' : 'bg-neon-cyan shadow-[0_0_10px_#22d3ee]'}`} 
                 />
              </div>
            </div>
          </div>

          <CareerMeter />
        </aside>

        {/* Main Panel: Simulation */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {endingLoading ? (
               <motion.div
                key="endingLoading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 glass rounded-3xl border border-white/10 flex flex-col items-center justify-center p-12 text-center"
              >
                <h3 className="font-orbitron text-4xl font-bold text-white tracking-tighter animate-pulse">EVALUATING LEGACY...</h3>
                <p className="mt-4 font-rajdhani text-neon-purple uppercase tracking-[0.5em] text-xs">Simulating all possible futures based on your path</p>
              </motion.div>
            ) : loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 glass rounded-3xl border border-white/10 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="relative">
                   <div className="absolute inset-0 bg-neon-cyan blur-3xl opacity-20 animate-pulse" />
                   <div className="h-32 w-32 rounded-full border-b-2 border-neon-cyan animate-spin" />
                   <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-neon-cyan" />
                </div>
                <h3 className="mt-8 font-orbitron text-2xl font-bold text-white neon-text-cyan tracking-tighter">SYNTHESIZING REALITY</h3>
                <p className="mt-2 font-rajdhani text-slate-400 uppercase tracking-[0.3em] text-xs">Accessing Llama-3.3 neural pathways...</p>
                <div className="mt-8 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [1, 2, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 h-4 bg-neon-cyan"
                    />
                  ))}
                </div>
              </motion.div>
            ) : outcome ? (
              <motion.div
                key="outcome"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 glass rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-[0_0_50px_rgba(168,85,247,0.1)]"
              >
                <div className="bg-gradient-to-r from-neon-purple/20 to-transparent p-8 border-b border-white/10 flex justify-between items-center">
                   <h2 className="font-orbitron text-3xl font-bold text-white tracking-tighter">CONSEQUENCE <span className="text-neon-purple">LOG</span></h2>
                   <div className="text-[10px] font-mono text-neon-purple border border-neon-purple/30 px-2 py-1 rounded">AUTH: SUCCESS</div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                   <div className="space-y-8">
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-rajdhani text-slate-200 leading-relaxed italic border-l-4 border-neon-purple pl-6 py-2"
                      >
                        "{outcome.text}"
                      </motion.p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                         {Object.entries(outcome.impact).map(([key, val]) => (
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              key={key} 
                              className={`glass p-4 rounded-xl border border-white/5 text-center group hover:bg-white/5 transition-all ${val! > 0 ? 'neon-border-cyan' : 'neon-border-purple'}`}
                            >
                               <div className="text-[9px] font-orbitron text-slate-500 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</div>
                               <div className={`text-xl font-bold font-orbitron mt-1 ${val! > 0 ? 'text-neon-cyan' : 'text-neon-red'}`}>
                                  {val! > 0 ? '+' : ''}{val}%
                                </div>
                            </motion.div>
                         ))}
                      </div>
                   </div>
                   
                   <button
                      onClick={nextScenario}
                      className="mt-12 group relative px-12 py-5 font-orbitron font-bold text-xl tracking-widest text-white transition-all duration-300 w-full md:w-auto self-end overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-neon-cyan/20 group-hover:bg-neon-cyan/30 transition-colors" />
                      <div className="absolute inset-0 border-2 border-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.8)]" />
                      <motion.div 
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />
                      <span className="relative flex items-center justify-center gap-3 uppercase">
                        Continue Simulation <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                </div>
              </motion.div>
            ) : scenario ? (
              <motion.div
                key="scenario"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex flex-col gap-6"
              >
                <div className="glass rounded-3xl border border-white/10 p-8 md:p-12 space-y-8 relative overflow-hidden min-h-[300px] flex flex-col justify-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
                  <div className={`absolute top-0 right-0 px-8 py-3 font-orbitron text-[10px] font-bold uppercase tracking-[0.4em] ${
                    scenario.riskLevel === 'Critical' ? 'bg-neon-red text-white' : 
                    scenario.riskLevel === 'High' ? 'bg-neon-pink text-white' :
                    'bg-neon-amber text-black'
                  }`}>
                    {scenario.riskLevel} POTENTIAL
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="h-px w-12 bg-neon-cyan" />
                             <div className="text-neon-cyan font-orbitron text-[10px] tracking-[0.4em] uppercase">Anomaly Detected</div>
                          </div>
                          <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white leading-none tracking-tighter neon-text-cyan">
                            {scenario.title}
                          </h2>
                       </div>
                       <button 
                         onClick={() => speak(scenario.description)}
                         className={`h-12 w-12 rounded-full border border-white/10 flex items-center justify-center transition-all ${isNarrating ? 'bg-neon-cyan text-black' : 'hover:bg-white/5 text-slate-400'}`}
                       >
                          <Volume2 size={20} className={isNarrating ? 'animate-pulse' : ''} />
                       </button>
                    </div>
                  </div>
                  
                  <p className="text-xl md:text-2xl font-rajdhani text-slate-300 leading-relaxed max-w-4xl border-l-2 border-white/10 pl-8">
                    {scenario.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {scenario.choices.map((choice, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleChoice(choice)}
                      className="glass p-8 rounded-2xl border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all text-left group flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-neon-cyan/5 rotate-45 translate-x-10 -translate-y-10 group-hover:bg-neon-cyan/10 transition-colors" />
                      <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-start">
                          <div className="h-10 w-10 rounded border border-white/10 flex items-center justify-center font-orbitron text-xs group-hover:bg-neon-cyan group-hover:text-black group-hover:border-neon-cyan transition-all shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                            0{i + 1}
                          </div>
                          <div className="h-1 w-8 bg-white/5 rounded-full" />
                        </div>
                        <p className="font-rajdhani text-xl text-slate-200 group-hover:text-white leading-snug">
                          {choice.text}
                        </p>
                      </div>
                      <div className="mt-8 flex items-center text-[10px] font-orbitron text-neon-cyan opacity-0 group-hover:opacity-100 transition-all uppercase tracking-[0.2em] translate-y-2 group-hover:translate-y-0">
                        Authorize <ChevronRight size={14} className="ml-1" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 glass rounded-3xl border border-white/10 flex flex-col items-center justify-center p-12 text-center">
                 <div className="h-20 w-20 rounded-full bg-neon-red/10 flex items-center justify-center mb-6 border border-neon-red/30">
                    <AlertTriangle className="h-10 w-10 text-neon-red" />
                 </div>
                 <h3 className="font-orbitron text-2xl font-bold text-white uppercase tracking-tighter">Neural Connection Failure</h3>
                 <p className="font-rajdhani text-slate-500 mt-2">The simulation link has been severed by unexpected AI interference.</p>
                 <button 
                  onClick={nextScenario} 
                  className="mt-8 flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/50 px-8 py-3 text-neon-cyan font-orbitron text-sm uppercase tracking-widest hover:bg-neon-cyan hover:text-black transition-all"
                 >
                   <RefreshCcw size={16} /> Re-establish Link
                 </button>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Right Panel: Social & History */}
        <aside className="lg:col-span-1 space-y-6">
          <SocialFeed />

          <div className="glass p-5 rounded-xl border border-white/10">
            <h5 className="font-orbitron text-[10px] text-neon-purple uppercase mb-4 tracking-widest flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-neon-purple animate-ping" />
              Decision Memory
            </h5>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {history.length > 0 ? history.map((h, i) => (
                <div key={i} className="border-l border-white/10 pl-3 space-y-1 opacity-70 hover:opacity-100 transition-opacity">
                  <div className="text-[10px] font-orbitron text-slate-500 truncate">{h.title}</div>
                  <div className="text-[11px] font-rajdhani text-neon-cyan italic">{">>"} {h.choice}</div>
                </div>
              )) : (
                <div className="text-[10px] font-rajdhani text-slate-600 uppercase italic">Awaiting initial input...</div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* News Ticker */}
      <footer className="glass h-12 rounded-xl border border-white/10 overflow-hidden flex items-center px-6 gap-6 relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-1 h-full bg-neon-red" />
        <div className="flex items-center gap-3 text-neon-red font-orbitron text-[11px] font-bold uppercase shrink-0 tracking-widest">
          <div className="h-2.5 w-2.5 rounded-full bg-neon-red animate-ping" />
          Neural-Net Broadcast
        </div>
        <div className="w-px h-6 bg-white/10" />
        <div className="flex-1 overflow-hidden">
          <motion.p
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="font-rajdhani text-[13px] text-slate-300 whitespace-nowrap uppercase tracking-[0.3em]"
          >
            // [ALERT] QUANTUM ENTROPY LEVELS RISING IN NEO-DELHI // [NEWS] FIRST FULL-AI CORPORATE BOARD ELECTED IN BERLIN // [SECURITY] BIOMETRIC HACKING REACHES CRITICAL LEVELS // [TECH] NEURAL-LINK FIRMWARE UPDATE 12.4 DEPLOYED // [SOCIAL] UNIVERSAL BASIC INCOME PROTESTS ENTER DAY 400 //
          </motion.p>
        </div>
      </footer>
    </main>
  );
}
