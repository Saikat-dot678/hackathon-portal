"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  const [activePhase, setActivePhase] = useState("registration");
  const [liveStage, setLiveStage] = useState("mentoring_2");
  const [currentTime, setCurrentTime] = useState<string>("");

  // --- NEW: Mock Database for Teams ---
  const [teams, setTeams] = useState([
    { id: "T-042", name: "Cyber Ninjas", track: "Cybersecurity", ps: "Smart Grid Defender", ppt: "link_to_ppt.pdf", status: "pending" },
    { id: "T-089", name: "Neural Nomads", track: "Artificial Intelligence", ps: "Predictive Healthcare", ppt: "link_to_ppt.pdf", status: "finalist" },
    { id: "T-104", name: "Byte Brawlers", track: "Web Development", ps: "Decentralized Voting", ppt: null, status: "pending" },
    { id: "T-221", name: "Ghost Proxies", track: "Internet of Things", ps: "Automated Drone Swarm", ppt: "link_to_ppt.pdf", status: "winner_1" },
    { id: "T-305", name: "Logic Bombs", track: "Open Innovation", ps: "Next-Gen Compiler", ppt: "link_to_ppt.pdf", status: "pending" },
  ]);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Action Handlers for the Admin Table
  const promoteToFinalist = (id: string) => {
    setTeams(teams.map(t => t.id === id ? { ...t, status: "finalist" } : t));
  };

  const markAsWinner = (id: string, rank: string) => {
    setTeams(teams.map(t => t.id === id ? { ...t, status: `winner_${rank}` } : t));
  };

  const demoteToPending = (id: string) => {
    setTeams(teams.map(t => t.id === id ? { ...t, status: "pending" } : t));
  };

  const phases = [
    { id: "locked", name: "System Locked", color: "text-red-400 border-red-500/50 bg-red-500/10" },
    { id: "registration", name: "Registration", color: "text-purple-400 border-purple-500/50 bg-purple-500/10" },
    { id: "problem_selection", name: "Problem Selection", color: "text-purple-400 border-purple-500/50 bg-purple-500/10" },
    { id: "ppt_submission", name: "PPT Submission", color: "text-purple-400 border-purple-500/50 bg-purple-500/10" },
    { id: "final_round", name: "Live Final Round", color: "text-fuchsia-400 border-fuchsia-500/50 bg-fuchsia-500/10 animate-pulse" },
    { id: "winners", name: "Official Results", color: "text-yellow-400 border-yellow-500/50 bg-yellow-500/10" },
  ];

  const logs = [
    { time: "02:21:45", msg: "Admin authentication successful. Clearance level: OVERSEER.", type: "system" },
    { time: "02:20:12", msg: "Team 'Cyber Ninjas' updated PPT submission.", type: "user" },
    { time: "02:15:00", msg: "Problem Statement 'Smart Grid Defender' capacity reached (0 spots left).", type: "alert" },
    { time: "01:45:33", msg: "New team registered: 'Neural Nomads'.", type: "user" },
  ];

  return (
    <div suppressHydrationWarning className="min-h-screen bg-black text-slate-300 font-sans selection:bg-fuchsia-500 selection:text-white p-4 md:p-8 pb-20">  
      {/* 1. ADMIN TOP BAR */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 pb-6 border-b border-red-900/50 relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <span className="text-red-500 animate-pulse">●</span> 
            BURNBRAIN <span className="text-red-500 font-mono font-normal text-xl"></span>
          </h1>
          <p className="text-xs font-mono text-red-400 tracking-widest uppercase mt-1"></p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="px-4 py-2 border border-slate-700 rounded-lg text-xs font-mono hover:bg-slate-800 transition-colors cursor-target">
            Return to Public Site ↗
          </Link>
          <button className="px-4 py-2 bg-red-900/30 border border-red-500/50 text-red-400 hover:bg-red-900/60 hover:text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-target">
            Terminate Session
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* A. QUICK STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Teams", val: teams.length, trend: "Live count" },
              { label: "Submissions", val: teams.filter(t => t.ppt).length, trend: "PPTs uploaded" },
              { label: "Finalists", val: teams.filter(t => t.status !== "pending").length, trend: "Selected", color: "text-fuchsia-400" },
              { label: "Active Phase", val: activePhase.replace('_', ' '), trend: "Live", color: "text-red-400 uppercase text-xs" },
            ].map((stat, i) => (
              <div key={i} className="bg-neutral-900/60 border border-purple-900/50 p-5 rounded-xl backdrop-blur-sm">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">{stat.label}</p>
                <p className={`text-3xl font-black text-white mb-1 tracking-tight ${stat.color || ''}`}>{stat.val}</p>
                <p className="text-xs font-mono text-slate-400">{stat.trend}</p>
              </div>
            ))}
          </div>

          {/* B. MASTER PHASE OVERRIDE */}
          <div className="bg-neutral-900/40 border border-purple-900/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.05)]">
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-fuchsia-500 rounded-full"></span> Global Phase Override
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phases.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all overflow-hidden cursor-target group ${
                    activePhase === phase.id 
                      ? phase.color 
                      : 'border-slate-800 bg-black/50 text-slate-500 hover:border-purple-500/50 hover:text-purple-300'
                  }`}
                >
                  {activePhase === phase.id && <div className="absolute inset-0 bg-current opacity-10 blur-xl"></div>}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                        {phase.id === 'locked' ? '🔒' : phase.id === 'winners' ? '🏆' : phase.id === 'final_round' ? '⚡' : '⚙️'}
                      </span>
                      {activePhase === phase.id && <span className="text-xs font-black uppercase tracking-widest">Active</span>}
                    </div>
                    <p className="font-bold text-sm tracking-wide">{phase.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Logs & Live Event */}
        <div className="space-y-8">
          
          <motion.div animate={{ opacity: activePhase === "final_round" ? 1 : 0.5, pointerEvents: activePhase === "final_round" ? "auto" : "none" }} className={`bg-neutral-900/60 border ${activePhase === "final_round" ? "border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.1)]" : "border-slate-800"} rounded-2xl p-6 backdrop-blur-sm`}>
            <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span> Live Stage Control
            </h2>
            <div className="bg-black border border-slate-800 rounded-lg p-4 mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Current Stage</p>
              <p className="text-lg font-bold text-fuchsia-400">{liveStage.replace('_', ' ').toUpperCase()}</p>
            </div>
            <button className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-sm uppercase tracking-widest rounded-lg transition-colors cursor-target shadow-[0_0_15px_rgba(217,70,239,0.4)]">
              Advance to Next Stage ↗
            </button>
          </motion.div>

          <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-6 h-[250px] flex flex-col font-mono text-xs shadow-inner">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
              <h2 className="text-slate-400 font-bold tracking-widest uppercase">System.Logs</h2>
            </div>
            <div className="flex-grow overflow-y-auto space-y-3 hide-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3 leading-relaxed">
                  <span className="text-slate-600 shrink-0">[{log.time}]</span>
                  <span className={log.type === 'system' ? 'text-blue-400' : log.type === 'alert' ? 'text-red-400' : 'text-green-400'}>
                    {log.type === 'alert' ? 'ERR:' : 'SYS:'} {log.msg}
                  </span>
                </div>
              ))}
              <div className="flex gap-3 leading-relaxed animate-pulse mt-2">
                <span className="text-slate-600">[{currentTime || "SYNCING..."}]</span>
                <span className="text-slate-400">Awaiting input<span className="text-fuchsia-500 font-black">_</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. NEW: TEAM MANAGEMENT DATABANK */}
      <div className="max-w-7xl mx-auto mt-8 bg-[#0a0a0a] border border-slate-800 rounded-2xl overflow-hidden relative z-10 shadow-xl">
        <div className="p-6 border-b border-slate-800 bg-neutral-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Team Databank
          </h2>
          <div className="flex gap-2">
            <input type="text" placeholder="Search ID or Name..." className="bg-black border border-slate-700 text-sm px-4 py-2 rounded-lg font-mono focus:outline-none focus:border-purple-500 w-full sm:w-auto" />
            <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-bold uppercase cursor-target transition-colors">Filter</button>
          </div>
        </div>

        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-900 text-slate-400 font-mono text-xs uppercase tracking-widest border-b border-slate-800">
              <tr>
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Team Name & Track</th>
                <th className="p-4">Problem Statement</th>
                <th className="p-4 text-center">Submission</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {teams.map((team) => (
                <tr key={team.id} className="hover:bg-purple-900/10 transition-colors group">
                  <td className="p-4 pl-6 font-mono text-purple-400 font-bold">{team.id}</td>
                  <td className="p-4">
                    <p className="text-white font-bold">{team.name}</p>
                    <p className="text-xs text-slate-500">{team.track}</p>
                  </td>
                  <td className="p-4 text-slate-300 max-w-[200px] truncate">{team.ps}</td>
                  <td className="p-4 text-center">
                    {team.ppt ? (
                      <a href="#" className="inline-block px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded text-xs font-mono hover:bg-green-500/20 cursor-target">
                        View PPT ↗
                      </a>
                    ) : (
                      <span className="text-xs text-slate-600 font-mono italic">Not Submitted</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                      team.status.includes('winner') ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                      team.status === 'finalist' ? 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {team.status === 'winner_1' ? '🥇 1st Place' : 
                       team.status === 'winner_2' ? '🥈 2nd Place' : 
                       team.status === 'winner_3' ? '🥉 3rd Place' : team.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    {/* Logic to show different buttons based on current team status */}
                    
                    {team.status === 'pending' && team.ppt && (
                      <button onClick={() => promoteToFinalist(team.id)} className="px-3 py-1 bg-fuchsia-600/20 text-fuchsia-400 hover:bg-fuchsia-600 hover:text-white border border-fuchsia-500/50 rounded text-xs font-bold uppercase transition-all cursor-target">
                        Promote ↗
                      </button>
                    )}

                    {team.status === 'finalist' && (
                      <div className="inline-flex gap-1">
                        <button onClick={() => markAsWinner(team.id, '1')} title="1st Place" className="w-8 h-8 flex items-center justify-center bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/30 text-yellow-400 rounded cursor-target">🥇</button>
                        <button onClick={() => markAsWinner(team.id, '2')} title="2nd Place" className="w-8 h-8 flex items-center justify-center bg-slate-300/10 border border-slate-400/30 hover:bg-slate-300/30 text-slate-300 rounded cursor-target">🥈</button>
                        <button onClick={() => markAsWinner(team.id, '3')} title="3rd Place" className="w-8 h-8 flex items-center justify-center bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/30 text-orange-400 rounded cursor-target">🥉</button>
                        <button onClick={() => demoteToPending(team.id)} title="Revoke" className="w-8 h-8 flex items-center justify-center bg-red-500/10 border border-red-500/30 hover:bg-red-500/30 text-red-400 rounded ml-2 cursor-target">✕</button>
                      </div>
                    )}
                    
                    {team.status.includes('winner') && (
                       <button onClick={() => promoteToFinalist(team.id)} className="px-3 py-1 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white rounded text-xs font-bold uppercase transition-all cursor-target">
                         Undo
                       </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}