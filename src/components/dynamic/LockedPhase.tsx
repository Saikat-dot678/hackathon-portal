"use client";

import { motion } from "framer-motion";

interface LockedPhaseProps {
  phaseName: string;
  unlockDate: string;
}

export default function LockedPhase({ phaseName, unlockDate }: LockedPhaseProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center bg-neutral-900/40 border border-purple-900/30 rounded-3xl backdrop-blur-md shadow-inner relative overflow-hidden"
    >
      {/* Subtle background lock styling */}
      <div className="absolute -top-10 -right-10 text-[15rem] opacity-5 pointer-events-none text-white font-black">
        🔒
      </div>

      <div className="w-20 h-20 bg-black border border-purple-500/30 rounded-full flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(168,85,247,0.2)] relative z-10">
        <span className="text-4xl grayscale opacity-80">🔒</span>
      </div>
      
      <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-4 relative z-10">
        Access Denied
      </h3>
      
      <p className="text-slate-400 max-w-md font-mono mb-10 text-sm md:text-base leading-relaxed relative z-10">
        The <span className="text-fuchsia-400 font-bold">[{phaseName}]</span> phase is currently locked by the administrators. 
        Telemetry indicates it will be available soon.
      </p>
      
      <div className="bg-black/60 border border-white/10 px-8 py-4 rounded-xl shadow-inner relative z-10 inline-block">
        <p className="text-xs md:text-sm text-slate-500 uppercase tracking-widest mb-2 font-bold">Scheduled Unlock</p>
        <p className="text-xl md:text-2xl font-black text-white tracking-wider font-mono">{unlockDate}</p>
      </div>
      
    </motion.div>
  );
}