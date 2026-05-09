"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Problem {
  _id: string;
  psId: string;
  title: string;
  domain: string;
  difficulty: string;
  description: string;
  maxTeams: number;
  selectedTeamsCount: number;
}

export default function ProblemSelectionPhase() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedPs, setSelectedPs] = useState<Problem | null>(null);
  const [authForm, setAuthForm] = useState({ teamName: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch("/api/problems", { cache: 'no-store' }); 
        const result = await res.json();
        if (result.success) {
          setProblems(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleSelect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPs) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/problems/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: authForm.teamName,
          password: authForm.password,
          psId: selectedPs.psId,
        }),
      });

      const result = await res.json();

      if (result.success) {
        alert("Success! Your team has locked this problem statement.");
        setSelectedPs(null);
        // Instantly update the UI count for the selected problem
        setProblems(problems.map(p => 
          p.psId === selectedPs.psId 
            ? { ...p, selectedTeamsCount: p.selectedTeamsCount + 1 } 
            : p
        ));
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      setAuthForm({ teamName: "", password: "" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 relative"
    >
      <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl backdrop-blur-md text-center">
        <p className="text-slate-300">
          Select your problem statement carefully. Selection is strictly <span className="text-white font-bold">first-come-first-serve</span>. Once locked, it cannot be changed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {problems.map((prob) => {
          const spotsLeft = prob.maxTeams - prob.selectedTeamsCount;
          
          return (
            <div key={prob.psId} className={`bg-neutral-900/60 border ${spotsLeft <= 0 ? 'border-red-900/50 opacity-60' : 'border-purple-900/50 hover:border-purple-500/50'} p-6 rounded-2xl backdrop-blur-md transition-all flex flex-col h-full overflow-hidden`}>
              
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-black text-purple-400 rounded-md text-xs border border-purple-900/50 font-bold uppercase tracking-wider shrink-0">
                  {prob.domain}
                </span>
                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border shrink-0 ${
                  prob.difficulty === 'Hard' || prob.difficulty === 'Advanced' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 
                  prob.difficulty === 'Medium' || prob.difficulty === 'Intermediate' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 
                  'bg-green-500/10 text-green-400 border-green-500/30'
                }`}>
                  {prob.difficulty}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{prob.psId}: {prob.title}</h3>
              
              {/* --- ADDED OVERFLOW-X-HIDDEN --- */}
              <div className="flex-grow overflow-y-auto overflow-x-hidden max-h-[120px] min-h-0 mb-6 pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-purple-900/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-purple-500/50 transition-colors">
                {/* --- ADDED BREAK-WORDS --- */}
                <p className="text-slate-400 text-sm whitespace-pre-wrap break-words leading-relaxed pb-2">
                  {prob.description}
                </p>
              </div>
              {/* ----------------------------------------- */}

              <div className="flex items-center justify-between border-t border-purple-900/30 pt-4 mt-auto">
                <span className="text-sm font-mono text-slate-300">
                  Spots left: <span className={spotsLeft <= 0 ? 'text-red-500 font-bold' : 'text-white'}>{spotsLeft}</span>
                </span>
                <button 
                  disabled={spotsLeft <= 0}
                  onClick={() => setSelectedPs(prob)}
                  className={`py-2 px-6 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
                    spotsLeft <= 0 
                      ? 'bg-neutral-800 text-slate-500 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] border border-purple-500/50'
                  }`}
                >
                  {spotsLeft <= 0 ? 'Locked' : 'Select Problem'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Authentication Modal */}
      <AnimatePresence>
        {selectedPs && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-neutral-900 border border-purple-500/50 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-[0_0_30px_rgba(168,85,247,0.2)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Team Authentication</h3>
                <button onClick={() => setSelectedPs(null)} className="text-slate-500 hover:text-red-400 text-xl font-bold">×</button>
              </div>
              
              <div className="bg-black/50 border border-purple-900/50 p-4 rounded-lg mb-6">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Locking Statement:</p>
                <p className="text-sm font-bold text-purple-400">{selectedPs.title}</p>
              </div>

              <form onSubmit={handleSelect} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Team Name</label>
                  <input 
                    type="text" required
                    value={authForm.teamName}
                    onChange={(e) => setAuthForm({...authForm, teamName: e.target.value})}
                    className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    placeholder="Enter registered team name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Team Password</label>
                  <input 
                    type="password" required
                    value={authForm.password}
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                    className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                
                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full py-3 mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest rounded-lg transition-colors shadow-[0_0_15px_rgba(147,51,234,0.4)] disabled:opacity-50"
                >
                  {isSubmitting ? "Verifying..." : "Confirm Selection"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}