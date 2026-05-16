"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Briefcase, Cpu, Sparkles, ArrowRight } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    profession: "",
    skills: "",
    interests: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userProfile", JSON.stringify(profile));
    router.push("/simulation");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] right-[10%] h-[30%] w-[30%] rounded-full bg-neon-purple/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-2xl rounded-2xl overflow-hidden border border-white/10"
      >
        <div className="bg-neon-cyan/10 p-8 border-b border-white/10">
          <h2 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
            <User className="text-neon-cyan" /> PROFILE INITIALIZATION
          </h2>
          <p className="text-slate-400 font-rajdhani mt-2 uppercase tracking-wider">
            Define your digital identity for the 2035 simulation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-rajdhani font-bold text-neon-cyan uppercase tracking-widest">
                <User size={16} /> Legal Name
              </label>
              <input
                required
                type="text"
                placeholder="Enter your name..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-4 font-rajdhani text-white focus:outline-none focus:border-neon-cyan/50 transition-colors"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-rajdhani font-bold text-neon-purple uppercase tracking-widest">
                <Briefcase size={16} /> Current Profession
              </label>
              <input
                required
                type="text"
                placeholder="Software Engineer, Artist, Manager..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-4 font-rajdhani text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                value={profile.profession}
                onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-rajdhani font-bold text-neon-pink uppercase tracking-widest">
                  <Cpu size={16} /> Key Skills
                </label>
                <textarea
                  required
                  placeholder="Coding, Design, Strategy..."
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-4 font-rajdhani text-white focus:outline-none focus:border-neon-pink/50 transition-colors h-32"
                  value={profile.skills}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-rajdhani font-bold text-neon-amber uppercase tracking-widest">
                  <Sparkles size={16} /> Core Interests
                </label>
                <textarea
                  required
                  placeholder="Gaming, History, Crypto..."
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-4 font-rajdhani text-white focus:outline-none focus:border-neon-amber/50 transition-colors h-32"
                  value={profile.interests}
                  onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full group relative px-8 py-4 font-orbitron font-bold text-lg tracking-widest text-white transition-all duration-300"
          >
            <div className="absolute inset-0 bg-neon-purple/20 group-hover:bg-neon-purple/30 transition-colors" />
            <div className="absolute inset-0 border-2 border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
            <span className="relative flex items-center justify-center gap-2">
              UPLOAD TO SURVIVOR OS <ArrowRight className="h-5 w-5" />
            </span>
          </button>
        </form>
      </motion.div>
    </main>
  );
}
