"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function FinalRoundPhase() {
  // --- DATABASE & SYSTEM STATES ---
  const [currentLiveStage, setCurrentLiveStage] = useState("mentoring_2");
  const [timeLeft, setTimeLeft] = useState({ hours: "00", minutes: "00", seconds: "00" });
  
  // Dynamic Judging Panels fetched from the database
  const [panels, setPanels] = useState<any[]>([]);
  
  // --- SUBMISSION FORM STATES ---
  const [form, setForm] = useState({ teamName: "", password: "", githubLink: "", liveLink: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const baseStages = [
    { id: "opening", name: "Opening Ceremony" },
    { id: "mentoring_1", name: "Mentoring Session 1" },
    { id: "mentoring_2", name: "Mentoring Session 2" },
    { id: "judge_review", name: "Judge Review" },
    { id: "final_judging", name: "Final Judging Round" },
    { id: "winners", name: "Winner Announcement" },
  ];

  // 1. Fetch live stage, countdown timer, and judging panels
  useEffect(() => {
    let targetDate = new Date().getTime() + (48 * 60 * 60 * 1000); // Fallback: 48 hours

    const fetchSystemData = async () => {
      try {
        const res = await fetch('/api/system', { cache: 'no-store' });
        const result = await res.json();
        
        if (result.success && result.data) {
          if (result.data.liveStage) {
            setCurrentLiveStage(result.data.liveStage);
          }
          if (result.data.timeline && result.data.timeline.finalRoundDate) {
            const startDate = new Date(result.data.timeline.finalRoundDate).getTime();
            targetDate = startDate + (48 * 60 * 60 * 1000); // 48 hours from kickoff
          }
          if (result.data.panels) {
            setPanels(result.data.panels);
          }
        }
      } catch (e) {
        console.error("Failed to fetch system data.");
      }
    };

    fetchSystemData();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        clearInterval(interval);
      } else {
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + Math.floor(difference / (1000 * 60 * 60 * 24)) * 24;
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({
          hours: h.toString().padStart(2, '0'),
          minutes: m.toString().padStart(2, '0'),
          seconds: s.toString().padStart(2, '0')
        });
      }
    }, 1000);

    const stageInterval = setInterval(fetchSystemData, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(stageInterval);
    };
  }, []);

  const currentStageIndex = baseStages.findIndex(s => s.id === currentLiveStage);
  const safeStageIndex = currentStageIndex === -1 ? 2 : currentStageIndex; 
  const progressPercentage = safeStageIndex <= 0 ? 0 : (safeStageIndex / (baseStages.length - 1)) * 100;

  const stages = baseStages.map((stage, idx) => ({
    ...stage,
    status: idx < safeStageIndex ? "completed" : idx === safeStageIndex ? "active" : "locked"
  }));

  const activeStageName = stages[safeStageIndex]?.name || "Live Round";

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/teams/final-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.success) {
        setFormStatus("success");
        setMessage(result.message);
      } else {
        setFormStatus("error");
        setMessage(result.error);
      }
    } catch (error) {
      setFormStatus("error");
      setMessage("A network error occurred. Please try again.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      
      {/* 1: TOP TIMELINE & COUNTDOWN */}
      <div className="bg-neutral-900/60 border border-purple-900/50 p-6 md:p-10 rounded-3xl backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-fuchsia-600/10 blur-[100px] rounded-full"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-purple-900/50 pb-8 relative z-10">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-fuchsia-500"></span>
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider">Live Event Status</h3>
            </div>
            <p className="text-purple-400 font-mono text-base text-center md:text-left">
              Build Phase Ends In: <span className="text-white font-bold text-xl ml-2 tracking-widest">{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</span>
            </p>
          </div>
          
          <div className="px-8 py-4 bg-purple-900/20 border border-purple-500/40 rounded-xl text-center shadow-inner">
            <p className="text-sm text-slate-400 uppercase tracking-widest mb-1 font-bold">Current Stage</p>
            <p className="text-2xl font-black text-white tracking-tight">{activeStageName}</p>
          </div>
        </div>

        <div className="w-full overflow-x-auto pb-6 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative z-10">
          <div className="relative flex items-start gap-6 md:gap-10 min-w-max px-4">
            <div className="absolute left-10 right-10 top-[1.25rem] md:top-[1.5rem] h-1.5 bg-neutral-800 z-0 rounded-full"></div>
            <div className="absolute left-10 top-[1.25rem] md:top-[1.5rem] h-1.5 bg-gradient-to-r from-purple-600 to-fuchsia-500 z-0 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all duration-1000 ease-in-out" style={{ width: `calc(${progressPercentage}% - 2rem)` }}></div>

            {stages.map((stage) => (
              <div key={stage.id} className="relative z-10 flex flex-col items-center w-32 md:w-40 gap-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  stage.status === 'completed' ? 'bg-purple-600 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.8)]' :
                  stage.status === 'active' ? 'bg-fuchsia-500 border-white shadow-[0_0_25px_rgba(217,70,239,0.8)] scale-110' :
                  'bg-neutral-900 border-slate-700'
                }`}>
                  {stage.status === 'completed' && <span className="text-white font-black text-lg">✓</span>}
                </div>
                <span className={`text-sm text-center font-bold uppercase tracking-wider px-2 leading-tight ${
                  stage.status === 'active' ? 'text-fuchsia-400' : 
                  stage.status === 'completed' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {stage.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2: FINAL SUBMISSION FORM */}
      <div className="bg-neutral-900/40 border border-fuchsia-900/50 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-lg">
        <div className="text-center mb-8 border-b border-fuchsia-900/30 pb-8">
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2">Final Codebase Deployment</h3>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Authorized Finalists must submit their final GitHub repository and Live Demo link before the 48-hour build timer expires. 
            <span className="text-fuchsia-400 font-bold block mt-1">This action is final and cannot be undone.</span>
          </p>
        </div>

        {formStatus === "success" ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
            <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <span className="text-4xl text-green-400">✓</span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Mission Accomplished</h3>
            <p className="text-slate-300 font-bold max-w-md mx-auto">{message}</p>
          </motion.div>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-6 max-w-3xl mx-auto">
            {formStatus === "error" && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-bold text-center">
                ⚠ {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Team Name</label>
                <input type="text" required value={form.teamName} onChange={(e) => setForm({...form, teamName: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-fuchsia-500 focus:outline-none transition-colors" placeholder="Registered team name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Team Password</label>
                <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-fuchsia-500 focus:outline-none transition-colors" placeholder="••••••••" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">GitHub Repository URL</label>
                <input type="url" required value={form.githubLink} onChange={(e) => setForm({...form, githubLink: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-fuchsia-500 focus:outline-none transition-colors font-mono text-sm" placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Live Demo URL</label>
                <input type="url" required value={form.liveLink} onChange={(e) => setForm({...form, liveLink: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-fuchsia-500 focus:outline-none transition-colors font-mono text-sm" placeholder="https://vercel.app/..." />
              </div>
            </div>
            
            <div className="pt-4">
              <button type="submit" disabled={formStatus === "submitting"} className="w-full py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black text-lg uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_30px_rgba(192,38,211,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
                {formStatus === "submitting" ? "Authenticating..." : "Deploy Final Build ↗"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3: PRESENTATION SCHEDULE PANELS */}
      <div>
        <h3 className="text-2xl md:text-3xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-4">
          <span className="h-px w-10 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span> Presentation Schedules
        </h3>
        
        {panels.length === 0 ? (
          <div className="bg-neutral-900/40 border border-purple-900/40 rounded-2xl p-10 text-center backdrop-blur-sm">
            <p className="text-slate-500 font-mono text-sm">Schedules have not been published by the admins yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {panels.map((panel, idx) => (
              <div key={idx} className="bg-neutral-900/40 border border-purple-900/40 rounded-3xl overflow-hidden backdrop-blur-sm shadow-lg">
                <div className="bg-purple-900/20 border-b border-purple-900/50 p-6 md:p-8">
                  <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mb-4">{panel.name}</h4>
                  <div className="flex flex-wrap gap-3">
                    {panel.judges && panel.judges.map((judge: string, jIdx: number) => (
                      <span key={jIdx} className="text-sm bg-black/50 text-purple-300 px-3 py-1.5 rounded-md border border-purple-800/50 font-bold">
                        {judge}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  {panel.schedule && panel.schedule.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-sm uppercase tracking-widest text-slate-500">
                          <th className="pb-4 pl-4 font-bold">Time</th>
                          <th className="pb-4 font-bold">Team Name</th>
                          <th className="pb-4 text-right pr-4 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {panel.schedule.map((slot: any, sIdx: number) => {
                          const currentStatus = slot.status || 'waiting'; 
                          return (
                            <tr key={sIdx} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors group">
                              <td className="py-5 pl-4 text-base font-mono font-bold text-purple-400">{slot.time}</td>
                              <td className="py-5 text-base font-black text-slate-200 group-hover:text-white transition-colors tracking-wide">{slot.team}</td>
                              <td className="py-5 text-right pr-4">
                                 <span className={`text-xs px-3 py-1.5 rounded-md font-black uppercase tracking-widest ${
                                   currentStatus === 'evaluated' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                                   currentStatus === 'up_next' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30 animate-pulse' :
                                   'bg-neutral-800 text-slate-500 border border-transparent'
                                 }`}>
                                   {currentStatus.replace('_', ' ')}
                                 </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-slate-500 text-sm font-mono text-center py-4">No teams assigned to this panel yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
}