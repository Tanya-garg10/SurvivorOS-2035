"use client";

import { motion } from "framer-motion";

const careers = [
  { name: "Software Developer", risk: 88 },
  { name: "Graphic Designer", risk: 72 },
  { name: "Data Analyst", risk: 95 },
  { name: "Content Writer", risk: 82 },
  { name: "Teacher", risk: 45 },
];

export default function CareerMeter() {
  return (
    <div className="glass p-5 rounded-2xl border border-white/10">
      <h5 className="font-orbitron text-[10px] text-neon-red uppercase mb-4 tracking-widest flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-neon-red animate-pulse" />
        Job Extinction Index
      </h5>
      <div className="space-y-3">
        {careers.map((job) => (
          <div key={job.name} className="space-y-1">
            <div className="flex justify-between text-[9px] font-rajdhani uppercase text-slate-400">
              <span>{job.name}</span>
              <span className={job.risk > 80 ? "text-neon-red" : "text-neon-amber"}>{job.risk}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${job.risk}%` }}
                className={`h-full ${job.risk > 80 ? 'bg-neon-red' : 'bg-neon-amber'}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
