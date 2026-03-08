"use client";

import { useState } from "react";
import RegistrationPhase from "./RegistrationPhase";
import ProblemSelectionPhase from "./ProblemSelectionPhase";
import PPTSubmissionPhase from "./PPTSubmissionPhase";
import FinalRoundPhase from "./FinalRoundPhase";
import WinnerAnnouncementPhase from "./WinnerAnnouncementPhase"; 
import LockedPhase from "./LockedPhase";

export default function DynamicEventSection() {
  const [activePhase, setActivePhase] = useState("winners");

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 scroll-mt-24" id="portal">
      
      {/* --- TEMPORARY DEV CONTROLS --- */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {/* FIX 1: Changed 'locked_Demo' to 'locked_demo' to match exactly */}
        {['registration', 'problem_selection', 'ppt_submission', 'final_round', 'winners', 'locked_demo'].map(phase => (
           <button 
             key={phase}
             onClick={() => setActivePhase(phase)}
             className={`px-3 py-1 text-xs font-mono uppercase tracking-widest rounded border ${activePhase === phase ? 'bg-purple-600 text-white border-purple-500' : 'bg-black text-slate-500 border-slate-800 hover:border-purple-900'}`}
           >
             {phase.replace('_', ' ')}
           </button>
        ))}
      </div>
      {/* ------------------------------ */}

      {/* 1. Dynamic Portal Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 uppercase tracking-tight mb-4">
          {activePhase === "registration" && "Team Registration"}
          {activePhase === "problem_selection" && "Problem Selection"}
          {activePhase === "ppt_submission" && "Project Submission"}
          {activePhase === "final_round" && "Live Final Round"}
          {activePhase === "winners" && "Official Results"}
          {/* Added a title for the locked state too! */}
          {activePhase === "locked_demo" && "System Locked"}
        </h2>
        
        {/* FIX 2: Hide Universal Countdown during locked_demo as well */}
        {activePhase !== "final_round" && activePhase !== "winners" && activePhase !== "locked_demo" && (
          <div className="flex justify-center gap-4 text-center mt-6">
            {[
              { label: "Days", value: "00" },
              { label: "Hours", value: "00" },
              { label: "Mins", value: "00" },
              { label: "Secs", value: "00" },
            ].map((time, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-900/80 border border-purple-500/30 rounded-xl flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono">{time.value}</span>
                </div>
                <span className="text-xs text-purple-400 mt-2 uppercase tracking-widest font-bold">{time.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Phase Content Switcher */}
      <div className="relative min-h-[400px]">
        {activePhase === "registration" && <RegistrationPhase />}
        {activePhase === "problem_selection" && <ProblemSelectionPhase />}
        {activePhase === "ppt_submission" && <PPTSubmissionPhase />}
        {activePhase === "final_round" && <FinalRoundPhase />}
        {activePhase === "winners" && <WinnerAnnouncementPhase />}
        
        {/* FIX 3: Moved LockedPhase down here where it belongs! */}
        {activePhase === "locked_demo" && (
          <LockedPhase 
            phaseName="Problem Selection" 
            unlockDate="September 20, 2025 @ 10:00 AM" 
          />
        )}
      </div>

    </div>
  );
}