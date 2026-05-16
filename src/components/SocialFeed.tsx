"use client";

import { motion } from "framer-motion";
import { MessageSquare, Heart, Share2 } from "lucide-react";

const posts = [
  { user: "@cyber_junkie", content: "AI took my job today. Living in the meta-slums now. 😭", likes: 124 },
  { user: "@neo_citizen", content: "Just got my 4th memory chip upgrade. I can finally code in my sleep! 🚀", likes: 890 },
  { user: "@rebel_human", content: "Protest in Neo-Delhi today! No more AI in the legal sector! #HumanRights", likes: 45 },
  { user: "@tech_guru", content: "The new Llama-9 update is insane. It's writing its own laws now. 😳", likes: 2301 },
];

export default function SocialFeed() {
  return (
    <div className="glass p-5 rounded-2xl border border-white/10">
      <h5 className="font-orbitron text-[10px] text-neon-cyan uppercase mb-4 tracking-widest flex items-center gap-2">
        <MessageSquare size={12} className="animate-pulse" />
        Neuro-Social Feed
      </h5>
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {posts.map((post, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-neon-purple">{post.user}</span>
              <span className="text-[9px] text-slate-500 italic">2m ago</span>
            </div>
            <p className="text-[11px] font-rajdhani text-slate-300 leading-tight">
              {post.content}
            </p>
            <div className="flex gap-3 text-[10px] text-slate-500 pt-1">
              <span className="flex items-center gap-1"><Heart size={10} /> {post.likes}</span>
              <span className="flex items-center gap-1"><Share2 size={10} /></span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
