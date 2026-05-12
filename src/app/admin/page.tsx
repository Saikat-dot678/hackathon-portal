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
  githubLink?: string;
  liveLink?: string;
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

interface Panel {
  name: string;
  judges: string[];
  schedule: { time: string; team: string; status: string }[];
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const [activePhase, setActivePhase] = useState("registration");
  const [liveStage, setLiveStage] = useState("opening");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [problems, setProblems] = useState<ProblemStatement[]>([]);

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
  
  // --- NEW: Problem Statement Edit State ---
  const [editingPsId, setEditingPsId] = useState<string | null>(null);

  // Panel Management States
  const [panels, setPanels] = useState<Panel[]>([]);
  const [panelForm, setPanelForm] = useState({ name: "", judges: "" });
  const [scheduleForm, setScheduleForm] = useState({ panelIdx: 0, time: "", team: "" });

  useEffect(() => {
    const fetchSystemState = async () => {
      try {
        const res = await fetch('/api/system', { cache: 'no-store' });
        const result = await res.json();
        if (result.success && result.data) {
          setActivePhase(result.data.activePhase);
          setLiveStage(result.data.liveStage || "opening");

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

          if (result.data.panels) {
            setPanels(result.data.panels);
          }
        }
      } catch (error) {
        console.error("Failed to fetch system state:", error);
      }
    };

    const fetchTeams = async () => {
      try {
        const res = await fetch('/api/teams', { cache: 'no-store' });
        const result = await res.json();
        if (result.success) setTeams(result.data);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    const fetchProblems = async () => {
      try {
        const res = await fetch('/api/problems', { cache: 'no-store' });
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
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false })), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePhaseChange = async (newPhase: string) => {
    setActivePhase(newPhase);
    try {
      await fetch('/api/system', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activePhase: newPhase }) });
    } catch (error) {
      console.error("Failed to update global phase:", error);
    }
  };

  const handleStageChange = async (newStage: string) => {
    setLiveStage(newStage);
    try {
      await fetch('/api/system', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ liveStage: newStage }) });
    } catch (error) {
      console.error("Failed to update live stage:", error);
    }
  };

  const handleTimelineSave = async () => {
    try {
      const res = await fetch('/api/system', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ timeline: timelineForm }) });
      if (res.ok) alert("Timeline Synced to Database Successfully!");
    } catch (error) {
      console.error("Failed to save timeline:", error);
    }
  };

  // --- UPDATED: Handle Create AND Edit Problem Statements ---
  const handleSubmitProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPS(true);
    try {
      if (editingPsId) {
        // Update existing
        const res = await fetch(`/api/problems/${editingPsId}`, { 
          method: 'PATCH', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(psForm) 
        });
        const result = await res.json();
        if (result.success) {
          // Update the local state
          setProblems(problems.map(p => p.psId === editingPsId ? { ...p, ...psForm } : p)); 
          cancelEditProblem();
          alert("Problem Statement Updated Successfully!");
        }
      } else {
        // Create new
        const res = await fetch('/api/problems', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(psForm) 
        });
        const result = await res.json();
        if (result.success) {
          setProblems([...problems, result.data]); 
          cancelEditProblem();
          alert("Problem Statement Created Successfully!");
        }
      }
    } catch (error) {
      console.error("Failed to save problem:", error);
    } finally {
      setIsSubmittingPS(false);
    }
  };

  const startEditProblem = (ps: ProblemStatement) => {
    setEditingPsId(ps.psId);
    setPsForm({
      title: ps.title,
      domain: ps.domain,
      difficulty: ps.difficulty,
      description: ps.description,
      maxTeams: ps.maxTeams
    });
    // Scroll to the top where the form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditProblem = () => {
    setEditingPsId(null);
    setPsForm({ title: "", domain: "Artificial Intelligence", difficulty: "Beginner", description: "", maxTeams: 5 });
  };

  const handleDeleteProblem = async (psId: string) => {
    if (!window.confirm(`Are you sure you want to delete ${psId}? Teams assigned to this might encounter errors.`)) return;
    try {
      const res = await fetch(`/api/problems/${psId}`, { method: 'DELETE' });
      if (res.ok) {
        setProblems(problems.filter(p => p.psId !== psId));
      } else {
        alert("Failed to delete problem statement.");
      }
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  const updateTeamStatus = async (id: string, newStatus: string) => {
    setTeams(teams.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      await fetch(`/api/teams/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
    } catch (error) {
      console.error(`Failed to update team ${id}:`, error);
    }
  };

  const promoteToFinalist = (id: string) => updateTeamStatus(id, "finalist");
  const demoteToPending = (id: string) => updateTeamStatus(id, "pending");

  // Panel Handlers
  const handleAddPanel = () => {
    if (!panelForm.name) return;
    const newPanelObj: Panel = {
      name: panelForm.name,
      judges: panelForm.judges.split(',').map(j => j.trim()).filter(j => j !== ""),
      schedule: []
    };
    setPanels([...panels, newPanelObj]);
    setPanelForm({ name: "", judges: "" });
  };

  const handleAddSchedule = () => {
    if (!scheduleForm.time || !scheduleForm.team || panels.length === 0) return;
    const updatedPanels = [...panels];
    updatedPanels[scheduleForm.panelIdx].schedule.push({ time: scheduleForm.time, team: scheduleForm.team, status: 'waiting' });
    
    updatedPanels[scheduleForm.panelIdx].schedule.sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
      const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
      return timeA - timeB;
    });

    setPanels(updatedPanels);
    setScheduleForm({ ...scheduleForm, time: "", team: "" });
  };

  const updateScheduleTime = (panelIdx: number, slotIdx: number, newTime: string) => {
    const updatedPanels = [...panels];
    updatedPanels[panelIdx].schedule[slotIdx].time = newTime;
    
    updatedPanels[panelIdx].schedule.sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
      const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
      return timeA - timeB;
    });
    setPanels(updatedPanels);
  };

  const updateScheduleStatus = (panelIdx: number, slotIdx: number, newStatus: string) => {
    const updatedPanels = [...panels];
    updatedPanels[panelIdx].schedule[slotIdx].status = newStatus;
    setPanels(updatedPanels);
  };

  const removeScheduleSlot = (panelIdx: number, slotIdx: number) => {
    const updatedPanels = [...panels];
    updatedPanels[panelIdx].schedule.splice(slotIdx, 1);
    setPanels(updatedPanels);
  };

  const handleSavePanelsToDB = async () => {
    try {
      const res = await fetch('/api/system', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ panels }) });
      if (res.ok) alert("Judging Panels successfully synced to the live portal!");
    } catch (error) {
      console.error("Failed to save panels:", error);
    }
  };

  const handleSystemReset = async () => {
    if (!window.confirm("⚠️ WARNING: This will delete ALL registered teams, reset problem capacities, and clear all judging panels. Your timeline and problem descriptions will be saved. Are you sure you want to run a factory reset?")) return;

    try {
      const res = await fetch('/api/system', { method: 'DELETE' });
      if (res.ok) {
        alert("System Reset Successful! The dashboard will now reload.");
        window.location.reload(); 
      } else {
        alert("Failed to reset the system.");
      }
    } catch (error) {
      console.error("Reset failed:", error);
    }
  };

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
    { id: 'panels', label: 'Judging Panels & Winners' },
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
              BURNBRAIN <span className="text-red-500 font-mono font-normal text-xl">ADMIN</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="px-4 py-2 border border-slate-700 rounded-lg text-xs font-mono hover:bg-slate-800 transition-colors cursor-target">
              Return to Public Site ↗
            </Link>
          </div>
        </div>

        <div className="flex justify-start md:justify-center gap-2 mt-6 overflow-x-auto hide-scrollbar pb-2 w-full">
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

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Teams", val: teams.length, trend: "Live count" },
                { label: "Submissions", val: teams.filter(t => t.ppt).length, trend: "PPTs uploaded" },
                { label: "Finalists", val: teams.filter(t => t.status === 'finalist' || t.status === 'COMPLETED' || t.status.includes('winner')).length, trend: "Selected", color: "text-fuchsia-400" },
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
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Current Stage</p>
                <select 
                  value={liveStage}
                  onChange={(e) => handleStageChange(e.target.value)}
                  className="w-full bg-neutral-900 border border-fuchsia-500/50 text-fuchsia-400 font-bold rounded px-3 py-3 text-sm focus:outline-none focus:border-fuchsia-500 uppercase tracking-wider cursor-pointer"
                >
                  <option value="opening">Opening Ceremony</option>
                  <option value="mentoring_1">Mentoring Session 1</option>
                  <option value="mentoring_2">Mentoring Session 2</option>
                  <option value="judge_review">Judge Review</option>
                  <option value="final_judging">Final Judging Round</option>
                  <option value="winners">Winner Announcement</option>
                </select>
              </div>
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

      {/* DATABANK TAB */}
      {activeTab === 'databank' && (
        <div className="max-w-7xl mx-auto bg-[#0a0a0a] border border-slate-800 rounded-2xl overflow-hidden relative z-10 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-slate-800 bg-neutral-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Master Roster
            </h2>
          </div>
          <div className="overflow-x-auto hide-scrollbar">
            {teams.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-mono text-sm">No teams registered yet.</div>
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
                          team.status === 'finalist' || team.status === 'COMPLETED' ? 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {team.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        {(team.status === 'pending' || team.status === 'SUBMITTED' || team.status === 'PROBLEM_SELECTED') ? (
                          <button onClick={() => promoteToFinalist(team.id)} className="px-3 py-1 bg-fuchsia-600/20 text-fuchsia-400 hover:bg-fuchsia-600 hover:text-white border border-fuchsia-500/50 rounded text-xs font-bold uppercase transition-all cursor-target">
                            Promote to Finalist
                          </button>
                        ) : team.status === 'finalist' ? (
                          <button onClick={() => demoteToPending(team.id)} className="px-3 py-1 bg-red-500/10 border border-red-500/30 hover:bg-red-500/30 text-red-400 rounded cursor-target uppercase font-bold text-xs tracking-wider">
                             Revoke
                          </button>
                        ) : (
                          <span className="text-xs text-slate-600 uppercase font-bold tracking-widest">Locked</span>
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

      {/* TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <div className="max-w-4xl mx-auto bg-neutral-900/60 border border-purple-900/50 rounded-2xl p-6 md:p-10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-purple-900/50 pb-4 gap-4">
            <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 bg-fuchsia-500 rounded-full"></span> Global Timeline Sync
            </h2>
            <button onClick={handleTimelineSave} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(147,51,234,0.4)]">
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
                    <input type="datetime-local" value={timelineForm[phase.start as keyof typeof timelineForm]} onChange={(e) => setTimelineForm({...timelineForm, [phase.start]: e.target.value})} className="w-full bg-neutral-900 border border-slate-700 text-slate-300 rounded px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-mono uppercase">End Date & Time</label>
                    <input type="datetime-local" value={timelineForm[phase.end as keyof typeof timelineForm]} onChange={(e) => setTimelineForm({...timelineForm, [phase.end]: e.target.value})} className="w-full bg-neutral-900 border border-slate-700 text-slate-300 rounded px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" />
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-black/50 border border-slate-800 p-5 rounded-xl">
              <h3 className="text-sm font-bold text-fuchsia-400 uppercase tracking-widest mb-4">Live Final Round</h3>
              <div>
                <label className="block text-xs text-slate-500 mb-1 font-mono uppercase">Event Kickoff Date</label>
                <input type="datetime-local" value={timelineForm.finalRoundDate} onChange={(e) => setTimelineForm({...timelineForm, finalRoundDate: e.target.value})} className="w-full max-w-sm bg-neutral-900 border border-slate-700 text-slate-300 rounded px-3 py-2 text-sm focus:border-fuchsia-500 focus:outline-none" />
              </div>
            </div>

            {/* DANGER ZONE */}
            <div className="bg-red-950/20 border border-red-900/50 p-6 md:p-8 rounded-xl mt-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
              <h3 className="text-sm font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="text-xl">⚠️</span> Danger Zone
              </h3>
              <p className="text-slate-400 text-sm mb-6 max-w-2xl leading-relaxed">
                Need to run a fresh test? This will permanently delete all registered teams in the Databank, reset problem statement capacities to 0, and clear all judging panels. Your timeline dates and problem statements will remain intact.
              </p>
              <button 
                onClick={handleSystemReset} 
                className="px-6 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/50 text-xs font-black uppercase tracking-widest rounded-lg transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)]"
              >
                Factory Reset Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          TAB 4: PROBLEM STATEMENTS
      ========================================= */}
      {activeTab === 'problems' && (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className={`bg-neutral-900/60 border ${editingPsId ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)]' : 'border-purple-900/50'} rounded-2xl p-6 md:p-10 backdrop-blur-sm transition-all`}>
            <div className="flex justify-between items-center mb-6 border-b border-purple-900/50 pb-4">
              <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${editingPsId ? 'bg-yellow-500' : 'bg-fuchsia-500'}`}></span> 
                {editingPsId ? `Editing: ${editingPsId}` : "Add Problem Statement"}
              </h2>
              {editingPsId && (
                <button onClick={cancelEditProblem} className="text-xs text-slate-400 hover:text-red-400 font-bold uppercase transition-colors">
                  Cancel Edit ✕
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmitProblem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 uppercase font-bold mb-2">Problem Title</label>
                  <input type="text" required value={psForm.title} onChange={(e) => setPsForm({...psForm, title: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 uppercase font-bold mb-2">Technical Domain</label>
                  <select value={psForm.domain} onChange={(e) => setPsForm({...psForm, domain: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none">
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
                    <select value={psForm.difficulty} onChange={(e) => setPsForm({...psForm, difficulty: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase font-bold mb-2">Capacity</label>
                    <input type="number" min="1" required value={psForm.maxTeams} onChange={(e) => setPsForm({...psForm, maxTeams: parseInt(e.target.value) || 5})} className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-400 uppercase font-bold mb-2">Description</label>
                  <textarea required rows={3} value={psForm.description} onChange={(e) => setPsForm({...psForm, description: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"></textarea>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={isSubmittingPS} className={`px-8 py-3 text-white font-bold uppercase tracking-widest rounded-lg transition-colors shadow-lg ${
                  editingPsId ? 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-600/30' : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
                }`}>
                  {isSubmittingPS ? "Processing..." : editingPsId ? "Save Changes" : "Publish Statement"}
                </button>
              </div>
            </form>
          </div>

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
                      <th className="p-4 pr-6 text-right">Actions</th>
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
                              ps.difficulty === 'Intermediate' ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'
                            }`}>
                              {ps.difficulty}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`font-mono text-lg font-bold ${isFull ? 'text-red-500' : 'text-slate-300'}`}>
                                {ps.selectedTeamsCount} <span className="text-slate-600 text-sm">/ {ps.maxTeams}</span>
                              </span>
                            </div>
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <button onClick={() => startEditProblem(ps)} className="px-3 py-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/50 rounded text-xs font-bold uppercase transition-all">Edit</button>
                            <button onClick={() => handleDeleteProblem(ps.psId)} className="px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50 rounded text-xs font-bold uppercase transition-all">Delete</button>
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
          TAB 5: JUDGING PANELS & WINNER SELECTION
      ========================================= */}
      {activeTab === 'panels' && (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* --- PART A: PANEL BUILDER --- */}
          <div className="bg-neutral-900/60 border border-blue-900/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
            <div className="flex justify-between items-center border-b border-blue-900/50 pb-4 mb-6">
              <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Judging Panel Builder
              </h2>
              <button 
                onClick={handleSavePanelsToDB}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)]"
              >
                Sync Panels to Public Portal ↗
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Add New Panel Form */}
              <div className="lg:col-span-1 space-y-4 bg-black/50 p-6 rounded-xl border border-slate-800">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">Create New Panel</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Panel Name</label>
                  <input type="text" value={panelForm.name} onChange={e => setPanelForm({...panelForm, name: e.target.value})} className="w-full bg-neutral-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" placeholder="e.g. Alpha Panel" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Judges (Comma separated)</label>
                  <input type="text" value={panelForm.judges} onChange={e => setPanelForm({...panelForm, judges: e.target.value})} className="w-full bg-neutral-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" placeholder="Sarah Chen, David Kim" />
                </div>
                <button onClick={handleAddPanel} className="w-full py-2 mt-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase rounded transition-colors">
                  Create Panel
                </button>
              </div>

              {/* Assign Teams to Schedule Form */}
              <div className="lg:col-span-2 space-y-4 bg-black/50 p-6 rounded-xl border border-slate-800">
                <h3 className="text-sm font-bold text-fuchsia-400 uppercase tracking-widest mb-4">Assign Teams to Schedule</h3>
                
                {panels.length === 0 ? (
                  <p className="text-slate-500 text-sm font-mono">Create a panel first to start scheduling teams.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Panel</label>
                      <select value={scheduleForm.panelIdx} onChange={e => setScheduleForm({...scheduleForm, panelIdx: parseInt(e.target.value)})} className="w-full bg-neutral-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-fuchsia-500 outline-none">
                        {panels.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Team</label>
                      <select value={scheduleForm.team} onChange={e => setScheduleForm({...scheduleForm, team: e.target.value})} className="w-full bg-neutral-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-fuchsia-500 outline-none">
                        <option value="">-- Choose Team --</option>
                        {teams.filter(t => t.status === 'finalist' || t.status === 'COMPLETED').map(t => (
                          <option key={t.id} value={t.name}>{t.name} ({t.track})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Time (e.g. 10:00 AM)</label>
                      <div className="flex gap-2">
                        <input type="time" value={scheduleForm.time} onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} className="w-full bg-neutral-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-fuchsia-500 outline-none" />
                        <button onClick={handleAddSchedule} className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold uppercase rounded transition-colors">Add</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Current Panels Preview */}
            {panels.length > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {panels.map((p, idx) => (
                  <div key={idx} className="border border-slate-800 rounded-lg p-4 bg-black">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-bold uppercase tracking-wider">{p.name}</h4>
                      <button onClick={() => setPanels(panels.filter((_, i) => i !== idx))} className="text-xs text-red-500 hover:text-red-400 font-bold uppercase">Delete Panel</button>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 font-mono">Judges: {p.judges.join(', ')}</p>
                    
                    <div className="space-y-2">
                      {p.schedule.map((slot, sIdx) => (
                        <div key={sIdx} className="flex flex-col xl:flex-row xl:items-center justify-between text-xs bg-neutral-900 p-2 rounded border border-slate-800 gap-3">
                          
                          <div className="flex items-center gap-3">
                            {/* Editable Time Input */}
                            <input 
                              type="time" 
                              value={slot.time} 
                              onChange={(e) => updateScheduleTime(idx, sIdx, e.target.value)} 
                              className="bg-black border border-slate-700 text-purple-400 font-mono font-bold px-2 py-1 rounded outline-none focus:border-purple-500 cursor-text" 
                            />
                            <span className="text-slate-300 font-bold">{slot.team}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 justify-between xl:justify-end">
                            {/* Admin Status Dropdown */}
                            <select 
                              value={slot.status || 'waiting'} 
                              onChange={(e) => updateScheduleStatus(idx, sIdx, e.target.value)} 
                              className={`bg-black border border-slate-700 px-2 py-1 rounded outline-none focus:border-purple-500 uppercase tracking-widest font-bold text-[10px] cursor-pointer ${
                                slot.status === 'evaluated' ? 'text-green-400' :
                                slot.status === 'up_next' ? 'text-purple-400' : 'text-slate-500'
                              }`}
                            >
                              <option value="waiting">Waiting</option>
                              <option value="up_next">Up Next</option>
                              <option value="evaluated">Evaluated</option>
                            </select>
                            
                            <button onClick={() => removeScheduleSlot(idx, sIdx)} className="text-red-500 hover:text-red-400 font-bold ml-1 px-2 py-1 bg-red-500/10 rounded">✕</button>
                          </div>

                        </div>
                      ))}
                      {p.schedule.length === 0 && <p className="text-xs text-slate-600 italic">No teams assigned yet.</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- PART B: WINNER SELECTION --- */}
          <div className="bg-[#0a0a0a] border border-yellow-900/50 rounded-2xl overflow-hidden relative z-10 shadow-xl">
            <div className="p-6 border-b border-slate-800 bg-neutral-900/50">
              <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 uppercase tracking-widest flex items-center gap-3">
                <span className="text-2xl">🏆</span> Winner Selection & Final Review
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Review completed projects and officially crown the champions. Assigning a winner here will immediately reflect on the public Winner Announcement phase.
              </p>
            </div>

            <div className="overflow-x-auto hide-scrollbar">
              {teams.filter(t => t.status === 'COMPLETED' || t.status.includes('winner')).length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-mono text-sm">
                  Waiting for finalists to submit their final repositories.
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-neutral-900 text-slate-400 font-mono text-xs uppercase tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="p-4 pl-6">Team Details</th>
                      <th className="p-4">Track / Problem</th>
                      <th className="p-4 text-center">Repository</th>
                      <th className="p-4 text-center">Live Demo</th>
                      <th className="p-4 text-center">Official Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {teams.filter(t => t.status === 'COMPLETED' || t.status.includes('winner')).map((team) => (
                      <tr key={team.id} className={`transition-colors group ${team.status.includes('winner') ? 'bg-yellow-900/10' : 'hover:bg-neutral-900'}`}>
                        <td className="p-4 pl-6">
                          <p className="text-white font-bold">{team.name}</p>
                          <p className="font-mono text-slate-500 text-xs">{team.id}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-300 text-xs font-bold uppercase tracking-wide">{team.track}</p>
                          <p className="text-slate-500 text-xs max-w-[200px] truncate" title={team.ps}>{team.ps}</p>
                        </td>
                        <td className="p-4 text-center">
                          {team.githubLink ? (
                            <a href={team.githubLink} target="_blank" rel="noreferrer" className="inline-block px-3 py-1 bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white rounded text-xs font-mono transition-colors">
                              GitHub ↗
                            </a>
                          ) : <span className="text-xs text-slate-600 italic">Missing</span>}
                        </td>
                        <td className="p-4 text-center">
                          {team.liveLink ? (
                            <a href={team.liveLink} target="_blank" rel="noreferrer" className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 hover:text-blue-300 rounded text-xs font-mono transition-colors">
                              Demo ↗
                            </a>
                          ) : <span className="text-xs text-slate-600 italic">Missing</span>}
                        </td>
                        <td className="p-4 text-center">
                          <select 
                            value={team.status}
                            onChange={(e) => updateTeamStatus(team.id, e.target.value)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider outline-none border cursor-pointer ${
                              team.status.includes('winner') 
                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                                : 'bg-black text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="COMPLETED">Under Review</option>
                            <option value="winner_1">🥇 1st Place Winner</option>
                            <option value="winner_2">🥈 2nd Place Winner</option>
                            <option value="winner_3">🥉 3rd Place Winner</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}