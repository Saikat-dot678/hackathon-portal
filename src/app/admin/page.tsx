"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Team {
  id: string;
  name: string;
  track: string;
  ps: string;
  ppt: string | null;
  status: string;
}

interface ProblemStatement {
  _id?: string;
  psId: string;
  title: string;
  domain: string;
  difficulty: string;
  description: string;
  maxTeams: number;
  selectedTeamsCount: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard', 'databank', 'timeline', 'problems', 'panels'
  
  const [activePhase, setActivePhase] = useState("registration");
  const [liveStage, setLiveStage] = useState("mentoring_2");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [problems, setProblems] = useState<ProblemStatement[]>([]);

  // Forms State
  const [timelineForm, setTimelineForm] = useState({
    registrationStart: "", registrationEnd: "",
    problemSelectionStart: "", problemSelectionEnd: "",
    pptSubmissionStart: "", pptSubmissionEnd: "", 
    finalRoundDate: ""
  });

  const [psForm, setPsForm] = useState({
    title: "", domain: "Artificial Intelligence", difficulty: "Beginner", description: "", maxTeams: 5
  });
  const [isSubmittingPS, setIsSubmittingPS] = useState(false);

  // AUTH CHECK
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin_token='))
      ?.split('=')[1];

    if (token !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      window.location.href = '/admin/login';
    }
  }, []);

  // 1. Fetch Data
  useEffect(() => {
    const fetchSystemState = async () => {
      try {
        const res = await fetch('/api/system');
        const result = await res.json();
        if (result.success && result.data) {
          setActivePhase(result.data.activePhase);
          setLiveStage(result.data.liveStage);

          if (result.data.timeline) {
            const formatForInput = (isoString: string) => isoString ? new Date(isoString).toISOString().slice(0, 16) : "";
            setTimelineForm({
              registrationStart: formatForInput(result.data.timeline.registrationStart),
              registrationEnd: formatForInput(result.data.timeline.registrationEnd),
              problemSelectionStart: formatForInput(result.data.timeline.problemSelectionStart),
              problemSelectionEnd: formatForInput(result.data.timeline.problemSelectionEnd),
              pptSubmissionStart: formatForInput(result.data.timeline.pptSubmissionStart),
              pptSubmissionEnd: formatForInput(result.data.timeline.pptSubmissionEnd),
              finalRoundDate: formatForInput(result.data.timeline.finalRoundDate),
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch system state:", error);
      }
    };

    const fetchTeams = async () => {
      try {
        const res = await fetch('/api/teams');
        const result = await res.json();
        if (result.success) setTeams(result.data);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    const fetchProblems = async () => {
      try {
        const res = await fetch('/api/problems');
        const result = await res.json();
        if (result.success) setProblems(result.data);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      }
    };

    fetchSystemState();
    fetchTeams();
    fetchProblems();

    setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Action Handlers
  const handlePhaseChange = async (newPhase: string) => {
    setActivePhase(newPhase);
    try {
      await fetch('/api/system', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activePhase: newPhase })
      });
    } catch (error) {
      console.error("Failed to update global phase:", error);
    }
  };

  const handleTimelineSave = async () => {
    try {
      const res = await fetch('/api/system', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeline: timelineForm })
      });
      if (res.ok) alert("Timeline Synced to Database Successfully!");
    } catch (error) {
      console.error("Failed to save timeline:", error);
      alert("Error saving timeline.");
    }
  };

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPS(true);
    try {
      const res = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(psForm)
      });
      const result = await res.json();
      
      if (result.success) {
        setProblems([...problems, result.data]); // Update UI instantly
        setPsForm({ title: "", domain: "Artificial Intelligence", difficulty: "Beginner", description: "", maxTeams: 5 }); // Reset form
        alert("Problem Statement Created Successfully!");
      }
    } catch (error) {
      console.error("Failed to create problem:", error);
      alert("Error creating problem statement.");
    } finally {
      setIsSubmittingPS(false);
    }
  };

  const updateTeamStatus = async (id: string, newStatus: string) => {
    setTeams(teams.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      await fetch(`/api/teams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (error) {
      console.error(`Failed to update team ${id}:`, error);
    }
  };

  const promoteToFinalist = (id: string) => updateTeamStatus(id, "finalist");
  const markAsWinner = (id: string, rank: string) => updateTeamStatus(id, `winner_${rank}`);
  const demoteToPending = (id: string) => updateTeamStatus(id, "pending");

  const phases = [
    { id: "locked", name: "System Locked", color: "text-red-400 border-red-500/50 bg-red-500/10" },
    { id: "registration", name: "Registration", color: "text-purple-400 border-purple-500/50 bg-purple-500/10" },
    { id: "problem_selection", name: "Problem Selection", color: "text-purple-400 border-purple-500/50 bg-purple-500/10" },
    { id: "ppt_submission", name: "PPT Submission", color: "text-purple-400 border-purple-500/50 bg-purple-500/10" },
    { id: "final_round", name: "Live Final Round", color: "text-fuchsia-400 border-fuchsia-500/50 bg-fuchsia-500/10 animate-pulse" },
    { id: "winners", name: "Official Results", color: "text-yellow-400 border-yellow-500/50 bg-yellow-500/10" },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Live Dashboard' },
    { id: 'databank', label: 'Team Databank' },
    { id: 'timeline', label: 'Timeline Config' },
    { id: 'problems', label: 'Problem Statements' },
    { id: 'panels', label: 'Judging Panels' },
  ];

  return (
    <div suppressHydrationWarning className="min-h-screen bg-black text-slate-300 font-sans selection:bg-fuchsia-500 selection:text-white p-4 md:p-8 pb-20">  
      
      {/* 1. ADMIN TOP BAR & TABS */}
      <header className="mb-8 relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-red-900/50">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter flex items-center gap-3">
              <span className="text-red-500 animate-pulse">●</span> 
              BURNBRAIN <span className="text-red-500 font-mono font-normal text-xl">OVERSEER</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="px-4 py-2 border border-slate-700 rounded-lg text-xs font-mono hover:bg-slate-800 transition-colors cursor-target">
              Return to Public Site ↗
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mt-6 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap cursor-target ${
                activeTab === tab.id 
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                  : 'bg-neutral-900 text-slate-500 border border-slate-800 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* =========================================
          TAB 1: LIVE DASHBOARD
      ========================================= */}
      {activeTab === 'dashboard' && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 space-y-8">
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

            <div className="bg-neutral-900/40 border border-purple-900/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.05)]">
              <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-2 h-2 bg-fuchsia-500 rounded-full"></span> Global Phase Override
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {phases.map((phase) => (
                  <button
                    key={phase.id}
                    onClick={() => handlePhaseChange(phase.id)}
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
                Advance Stage ↗
              </button>
            </motion.div>

            <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-6 h-[250px] flex flex-col font-mono text-xs shadow-inner">
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                <h2 className="text-slate-400 font-bold tracking-widest uppercase">System.Logs</h2>
              </div>
              <div className="flex-grow overflow-y-auto space-y-3 hide-scrollbar">
                <div className="flex gap-3 leading-relaxed">
                  <span className="text-slate-600 shrink-0">[02:21:45]</span>
                  <span className="text-blue-400">SYS: Admin authentication successful. Clearance level: OVERSEER.</span>
                </div>
                <div className="flex gap-3 leading-relaxed animate-pulse mt-2">
                  <span className="text-slate-600">[{currentTime || "SYNCING..."}]</span>
                  <span className="text-slate-400">Awaiting input<span className="text-fuchsia-500 font-black">_</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          TAB 2: TEAM DATABANK
      ========================================= */}
      {activeTab === 'databank' && (
        <div className="max-w-7xl mx-auto bg-[#0a0a0a] border border-slate-800 rounded-2xl overflow-hidden relative z-10 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-slate-800 bg-neutral-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Master Roster
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <input type="text" placeholder="Search ID or Name..." className="bg-black border border-slate-700 text-sm px-4 py-2 rounded-lg font-mono focus:outline-none focus:border-purple-500 w-full sm:w-64" />
              <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-bold uppercase cursor-target transition-colors">Filter</button>
            </div>
          </div>

          <div className="overflow-x-auto hide-scrollbar">
            {teams.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-mono text-sm">
                No teams registered yet.
              </div>
            ) : (
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
                          <a href={team.ppt} target="_blank" rel="noreferrer" className="inline-block px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded text-xs font-mono hover:bg-green-500/20 cursor-target">
                            View PPT ↗
                          </a>
                        ) : (
                          <span className="text-xs text-slate-600 font-mono italic">Pending</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                          team.status.includes('winner') ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                          team.status === 'finalist' ? 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {team.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        {team.status === 'pending' && (
                          <button onClick={() => promoteToFinalist(team.id)} className="px-3 py-1 bg-fuchsia-600/20 text-fuchsia-400 hover:bg-fuchsia-600 hover:text-white border border-fuchsia-500/50 rounded text-xs font-bold uppercase transition-all cursor-target">
                            Promote
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
            )}
          </div>
        </div>
      )}

      {/* =========================================
          TAB 3: TIMELINE CONFIGURATION
      ========================================= */}
      {activeTab === 'timeline' && (
        <div className="max-w-4xl mx-auto bg-neutral-900/60 border border-purple-900/50 rounded-2xl p-6 md:p-10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-purple-900/50 pb-4 gap-4">
            <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 bg-fuchsia-500 rounded-full"></span> Global Timeline Sync
            </h2>
            <button 
              onClick={handleTimelineSave}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(147,51,234,0.4)]"
            >
              Save Dates
            </button>
          </div>

          <div className="space-y-8">
            {[
              { title: "Registration Phase", start: "registrationStart", end: "registrationEnd" },
              { title: "Problem Selection", start: "problemSelectionStart", end: "problemSelectionEnd" },
              { title: "PPT Submission", start: "pptSubmissionStart", end: "pptSubmissionEnd" },
            ].map((phase, idx) => (
              <div key={idx} className="bg-black/50 border border-slate-800 p-5 rounded-xl">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4">{phase.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-mono uppercase">Start Date & Time</label>
                    <input 
                      type="datetime-local" 
                      value={timelineForm[phase.start as keyof typeof timelineForm]}
                      onChange={(e) => setTimelineForm({...timelineForm, [phase.start]: e.target.value})}
                      className="w-full bg-neutral-900 border border-slate-700 text-slate-300 rounded px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-mono uppercase">End Date & Time</label>
                    <input 
                      type="datetime-local" 
                      value={timelineForm[phase.end as keyof typeof timelineForm]}
                      onChange={(e) => setTimelineForm({...timelineForm, [phase.end]: e.target.value})}
                      className="w-full bg-neutral-900 border border-slate-700 text-slate-300 rounded px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" 
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-black/50 border border-slate-800 p-5 rounded-xl">
              <h3 className="text-sm font-bold text-fuchsia-400 uppercase tracking-widest mb-4">Live Final Round</h3>
              <div>
                <label className="block text-xs text-slate-500 mb-1 font-mono uppercase">Event Kickoff Date</label>
                <input 
                  type="datetime-local" 
                  value={timelineForm.finalRoundDate}
                  onChange={(e) => setTimelineForm({...timelineForm, finalRoundDate: e.target.value})}
                  className="w-full max-w-sm bg-neutral-900 border border-slate-700 text-slate-300 rounded px-3 py-2 text-sm focus:border-fuchsia-500 focus:outline-none" 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          TAB 4: PROBLEM STATEMENTS
      ========================================= */}
      {activeTab === 'problems' && (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Create Form */}
          <div className="bg-neutral-900/60 border border-purple-900/50 rounded-2xl p-6 md:p-10 backdrop-blur-sm">
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-purple-900/50 pb-4">
              <span className="w-2 h-2 bg-fuchsia-500 rounded-full"></span> Add Problem Statement
            </h2>
            
            <form onSubmit={handleCreateProblem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 uppercase font-bold mb-2">Problem Title</label>
                  <input 
                    type="text" required value={psForm.title} onChange={(e) => setPsForm({...psForm, title: e.target.value})}
                    className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none" 
                    placeholder="e.g., AI-Powered Predictive Healthcare"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 uppercase font-bold mb-2">Technical Domain</label>
                  <select 
                    value={psForm.domain} onChange={(e) => setPsForm({...psForm, domain: e.target.value})}
                    className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Internet of Things">Internet of Things</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Open Innovation">Open Innovation</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase font-bold mb-2">Difficulty</label>
                    <select 
                      value={psForm.difficulty} onChange={(e) => setPsForm({...psForm, difficulty: e.target.value})}
                      className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase font-bold mb-2">Max Teams (Capacity)</label>
                    <input 
                      type="number" min="1" required value={psForm.maxTeams} onChange={(e) => setPsForm({...psForm, maxTeams: parseInt(e.target.value)})}
                      className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 uppercase font-bold mb-2">Brief Description</label>
                  <textarea 
                    required rows={3} value={psForm.description} onChange={(e) => setPsForm({...psForm, description: e.target.value})}
                    className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none" 
                    placeholder="Describe the challenge parameters..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" disabled={isSubmittingPS}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest rounded-lg transition-colors shadow-[0_0_15px_rgba(147,51,234,0.4)] disabled:opacity-50"
                >
                  {isSubmittingPS ? "Adding..." : "Publish Statement ↗"}
                </button>
              </div>
            </form>
          </div>

          {/* Existing Statements Table */}
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 bg-neutral-900/50">
              <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Active Statements Database
              </h2>
            </div>
            
            <div className="overflow-x-auto hide-scrollbar">
              {problems.length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-mono text-sm">No problem statements published yet.</div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-neutral-900 text-slate-400 font-mono text-xs uppercase tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="p-4 pl-6">PS ID</th>
                      <th className="p-4">Title & Domain</th>
                      <th className="p-4 text-center">Difficulty</th>
                      <th className="p-4 text-center">Capacity Filled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {problems.map((ps) => {
                      const isFull = ps.selectedTeamsCount >= ps.maxTeams;
                      return (
                        <tr key={ps.psId} className="hover:bg-purple-900/10 transition-colors group">
                          <td className="p-4 pl-6 font-mono text-purple-400 font-bold">{ps.psId}</td>
                          <td className="p-4">
                            <p className="text-white font-bold">{ps.title}</p>
                            <p className="text-xs text-slate-500">{ps.domain}</p>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                              ps.difficulty === 'Beginner' ? 'text-green-400 bg-green-400/10' :
                              ps.difficulty === 'Intermediate' ? 'text-yellow-400 bg-yellow-400/10' :
                              'text-red-400 bg-red-400/10'
                            }`}>
                              {ps.difficulty}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`font-mono text-lg font-bold ${isFull ? 'text-red-500' : 'text-slate-300'}`}>
                                {ps.selectedTeamsCount} <span className="text-slate-600 text-sm">/ {ps.maxTeams}</span>
                              </span>
                              {isFull && <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Locked</span>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      )}

      {/* =========================================
          TAB 5: JUDGING PANELS (COMING SOON)
      ========================================= */}
      {activeTab === 'panels' && (
        <div className="max-w-4xl mx-auto bg-neutral-900/60 border border-dashed border-slate-700 rounded-2xl p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-4xl mb-4">⚖️</div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Panel Management</h2>
          <p className="text-slate-500 font-mono text-sm">Module under construction.</p>
        </div>
      )}

    </div>
  );
}