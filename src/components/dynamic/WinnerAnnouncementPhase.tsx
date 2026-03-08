"use client";

import { motion } from "framer-motion";

export default function WinnerAnnouncementPhase() {
  // Mock Data for the winners and special awards
  const winners = [
    { place: "1st Place", team: "Cyber Ninjas", project: "AI Threat Horizon", prize: "$5,000", badge: "🥇", glow: "shadow-[0_0_40px_rgba(234,179,8,0.3)]", border: "border-yellow-500/50", text: "text-yellow-400" },
    { place: "2nd Place", team: "Quantum Quacks", project: "Decentralized Vault", prize: "$2,500", badge: "🥈", glow: "shadow-[0_0_30px_rgba(148,163,184,0.2)]", border: "border-slate-400/50", text: "text-slate-300" },
    { place: "3rd Place", team: "Logic Bombers", project: "Smart Grid Defender", prize: "$1,000", badge: "🥉", glow: "shadow-[0_0_30px_rgba(249,115,22,0.2)]", border: "border-orange-500/50", text: "text-orange-400" },
  ];

  const specialAwards = [
    { name: "Best UI/UX Design", team: "Neural Nomads" },
    { name: "Most Innovative", team: "Byte Busters" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      
      {/* Confetti / Celebration Header */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl md:text-4xl font-black text-white tracking-widest uppercase">
          Hackathon <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Champions</span>
        </h3>
        <p className="text-slate-400 max-w-2xl mx-auto">
          After 48 hours of relentless coding, debugging, and building, we present the winners of BURNBRAIN 2025.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="flex flex-col gap-6">
        {winners.map((winner, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.2 }}
            className={`relative bg-neutral-900/80 border ${winner.border} rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md overflow-hidden ${winner.glow}`}
          >
            {/* Ambient Background Glow for 1st Place */}
            {idx === 0 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-yellow-500/5 blur-[100px] pointer-events-none"></div>}

            <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
              <div className="text-5xl md:text-6xl">{winner.badge}</div>
              <div>
                <p className={`text-sm font-black uppercase tracking-widest mb-1 ${winner.text}`}>{winner.place}</p>
                <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{winner.team}</h4>
                <p className="text-slate-400 text-sm mt-1 font-mono">Project: {winner.project}</p>
              </div>
            </div>

            <div className="relative z-10 bg-black/50 border border-white/10 px-6 py-3 rounded-lg text-center w-full md:w-auto">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Prize Pool</p>
              <p className={`text-2xl font-black ${winner.text}`}>{winner.prize}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Special Awards Section */}
      <div className="bg-purple-900/20 border border-purple-900/50 rounded-2xl p-6 md:p-8 backdrop-blur-md">
        <h4 className="text-xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-3">
          <span className="h-px w-8 bg-fuchsia-500"></span> Special Awards
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specialAwards.map((award, idx) => (
            <div key={idx} className="bg-black/40 border border-purple-500/30 p-4 rounded-xl flex justify-between items-center group hover:border-fuchsia-500/50 transition-colors">
              <div>
                <p className="text-xs text-fuchsia-400 font-bold uppercase tracking-wider mb-1">Award</p>
                <p className="text-white font-bold">{award.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Winner</p>
                <p className="text-purple-300 font-bold">{award.team}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}