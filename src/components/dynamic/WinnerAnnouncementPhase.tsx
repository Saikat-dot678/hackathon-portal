"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Team {
  id: string;
  name: string;
  track: string;
  ps: string;
  status: string;
}

export default function WinnerAnnouncementPhase() {
  const [winners, setWinners] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Winners from Database (with live polling)
  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await fetch("/api/teams", { cache: 'no-store' });
        const result = await res.json();
        
        if (result.success) {
          const winningTeams = result.data.filter((t: Team) => t.status.includes("winner_"));
          setWinners(winningTeams);
        }
      } catch (error) {
        console.error("Failed to fetch winners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
    const interval = setInterval(fetchWinners, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
      </div>
    );
  }

  const firstPlace = winners.find(w => w.status === "winner_1");
  const secondPlace = winners.find(w => w.status === "winner_2");
  const thirdPlace = winners.find(w => w.status === "winner_3");

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto py-10 relative"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 bg-yellow-600/10 blur-[120px] -z-10 pointer-events-none"></div>

      {/* Header Section */}
      <div className="text-center mb-20 relative">
        <motion.span 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="text-6xl md:text-7xl mb-6 block drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]"
        >
          🏆
        </motion.span>
        <h3 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 uppercase tracking-widest drop-shadow-sm">
          Champions of BurnBrain
        </h3>
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto font-mono text-sm">
          The 48-hour build phase has concluded. Behold the teams that rose above the rest.
        </p>
      </div>

      {winners.length === 0 ? (
        <div className="max-w-2xl mx-auto text-center bg-neutral-900/60 border border-yellow-900/30 p-10 rounded-3xl backdrop-blur-md shadow-xl">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-yellow-500 rounded-full animate-spin mx-auto mb-6"></div>
          <h4 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Judges are Deliberating</h4>
          <p className="text-slate-500 font-mono text-sm">Official results will be published shortly. Stand by.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-8 md:gap-6 mt-12 min-h-[450px]">
          
          {/* =========================================
              🥈 SECOND PLACE (Left)
          ========================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, type: "spring" }}
            className="w-full max-w-sm md:w-1/3 flex flex-col order-2 md:order-1"
          >
            {secondPlace ? (
              <div className="relative group w-full">
                {/* Animated Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-b from-slate-400 to-slate-800 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                
                <div className="relative h-[300px] bg-[#0a0a0a] border border-slate-700/50 rounded-[2rem] p-6 text-center flex flex-col items-center justify-between overflow-hidden shadow-2xl">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-slate-500/10 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="relative z-10 flex items-center justify-center w-20 h-20 mb-2 rounded-full bg-slate-800/50 border border-slate-500/30 shadow-[0_0_20px_rgba(148,163,184,0.15)]">
                    <span className="text-5xl drop-shadow-md">🥈</span>
                  </div>

                  <div className="relative z-10 w-full">
                    <h5 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-400 mb-1 truncate px-2">{secondPlace.name}</h5>
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-5 font-bold">{secondPlace.id}</p>
                    
                    <div className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-slate-900/80 border border-slate-600/50 w-full max-w-[90%] mx-auto shadow-inner">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-300 truncate">{secondPlace.track}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[300px] bg-neutral-900/20 border border-dashed border-slate-800 rounded-[2rem] flex items-center justify-center text-slate-700 font-mono text-xs uppercase tracking-widest">Awaiting Silver</div>
            )}
          </motion.div>

          {/* =========================================
              🥇 FIRST PLACE (Center)
          ========================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 150 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, type: "spring" }}
            className="w-full max-w-sm md:w-1/3 flex flex-col order-1 md:order-2 z-10 md:-mb-10"
          >
            {firstPlace ? (
              <div className="relative group w-full">
                {/* Supreme Gold Glow */}
                <div className="absolute -inset-1 bg-gradient-to-b from-yellow-300 via-yellow-600 to-yellow-900 rounded-[2rem] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                
                <div className="relative h-[380px] bg-[#0a0a0a] border border-yellow-500/50 rounded-[2rem] p-8 text-center flex flex-col items-center justify-between overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="relative z-10 flex items-center justify-center w-28 h-28 mb-4 rounded-full bg-yellow-900/40 border-2 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                    <span className="text-6xl drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">🥇</span>
                  </div>

                  <div className="relative z-10 w-full mt-auto">
                    <h5 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-500 mb-2 truncate px-2">{firstPlace.name}</h5>
                    <p className="text-sm text-yellow-500/80 font-mono uppercase tracking-widest mb-6 font-bold">{firstPlace.id}</p>
                    
                    <div className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-yellow-950/40 border border-yellow-500/30 w-full shadow-inner backdrop-blur-md">
                      <span className="text-xs font-black uppercase tracking-widest text-yellow-400 truncate">
                        {firstPlace.track}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[380px] bg-neutral-900/20 border border-dashed border-yellow-900/50 rounded-[2rem] flex items-center justify-center text-yellow-900/50 font-mono text-xs uppercase tracking-widest">Awaiting Gold</div>
            )}
          </motion.div>

          {/* =========================================
              🥉 THIRD PLACE (Right)
          ========================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: "spring" }}
            className="w-full max-w-sm md:w-1/3 flex flex-col order-3"
          >
            {thirdPlace ? (
              <div className="relative group w-full">
                {/* Animated Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-b from-orange-500 to-orange-900 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                
                <div className="relative h-[260px] bg-[#0a0a0a] border border-orange-800/50 rounded-[2rem] p-6 text-center flex flex-col items-center justify-between overflow-hidden shadow-2xl">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="relative z-10 flex items-center justify-center w-16 h-16 mb-2 rounded-full bg-orange-900/30 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                    <span className="text-4xl drop-shadow-md">🥉</span>
                  </div>

                  <div className="relative z-10 w-full">
                    <h5 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-100 to-orange-500 mb-1 truncate px-2">{thirdPlace.name}</h5>
                    <p className="text-[10px] text-orange-600 font-mono uppercase tracking-widest mb-4 font-bold">{thirdPlace.id}</p>
                    
                    <div className="inline-flex items-center justify-center px-3 py-2 rounded-full bg-orange-950/30 border border-orange-800/50 w-full max-w-[90%] mx-auto shadow-inner">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 truncate">{thirdPlace.track}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[260px] bg-neutral-900/20 border border-dashed border-orange-900/30 rounded-[2rem] flex items-center justify-center text-orange-900/50 font-mono text-xs uppercase tracking-widest">Awaiting Bronze</div>
            )}
          </motion.div>

        </div>
      )}
    </motion.div>
  );
}