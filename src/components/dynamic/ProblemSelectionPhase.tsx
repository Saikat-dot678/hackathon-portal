"use client";

import { motion } from "framer-motion";

export default function ProblemSelectionPhase() {
  // Dummy data based on the required fields
  const problems = [
    { id: 1, title: "AI-Powered Threat Detection", domain: "Artificial Intelligence", difficulty: "Hard", spotsLeft: 2, desc: "Build an ML model to detect zero-day anomalies in network traffic logs." },
    { id: 2, title: "Decentralized Identity Vault", domain: "Web Development", difficulty: "Medium", spotsLeft: 5, desc: "Create a secure, blockchain-backed identity verification portal for IoT devices." },
    { id: 3, title: "Smart Grid Defender", domain: "Internet of Things", difficulty: "Hard", spotsLeft: 0, desc: "Develop a hardware-level failsafe for simulated SCADA infrastructure." },
    { id: 4, title: "Open Source Intelligence Scraper", domain: "Cybersecurity", difficulty: "Easy", spotsLeft: 12, desc: "Design a tool to aggregate and correlate leaked credentials from public paste sites." },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl backdrop-blur-md text-center">
        <p className="text-slate-300">
          Select your problem statement carefully. Selection is strictly <span className="text-white font-bold">first-come-first-serve</span>. Once locked, it cannot be changed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {problems.map((prob) => (
          <div key={prob.id} className={`bg-neutral-900/60 border ${prob.spotsLeft === 0 ? 'border-red-900/50 opacity-60' : 'border-purple-900/50 hover:border-purple-500/50'} p-6 rounded-2xl backdrop-blur-md transition-all flex flex-col h-full`}>
            
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-black text-purple-400 rounded-md text-xs border border-purple-900/50 font-bold uppercase tracking-wider">
                {prob.domain}
              </span>
              <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                prob.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 
                prob.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 
                'bg-green-500/10 text-green-400 border-green-500/30'
              }`}>
                {prob.difficulty}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{prob.title}</h3>
            <p className="text-slate-400 text-sm mb-6 flex-grow">{prob.desc}</p>
            
            <div className="flex items-center justify-between border-t border-purple-900/30 pt-4 mt-auto">
              <span className="text-sm font-mono text-slate-300">
                Spots left: <span className={prob.spotsLeft === 0 ? 'text-red-500 font-bold' : 'text-white'}>{prob.spotsLeft}</span>
              </span>
              <button 
                disabled={prob.spotsLeft === 0}
                className={`py-2 px-6 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
                  prob.spotsLeft === 0 
                    ? 'bg-neutral-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] border border-purple-500/50'
                }`}
              >
                {prob.spotsLeft === 0 ? 'Locked' : 'Select Problem'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}