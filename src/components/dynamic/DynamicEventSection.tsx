"use client";

import { useState, useEffect } from "react";
import RegistrationPhase from "./RegistrationPhase";
import ProblemSelectionPhase from "./ProblemSelectionPhase";
import PPTSubmissionPhase from "./PPTSubmissionPhase";
import FinalRoundPhase from "./FinalRoundPhase";
import WinnerAnnouncementPhase from "./WinnerAnnouncementPhase"; 
import LockedPhase from "./LockedPhase";

export default function DynamicEventSection() {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [unlockDate, setUnlockDate] = useState<string>("TBD");
  const [loading, setLoading] = useState(true);

  // Fetch the live phase and timeline from the database
  useEffect(() => {
    const fetchCurrentSystemState = async () => {
      try {
        const res = await fetch('/api/system', { cache: 'no-store' });
        const result = await res.json();
        
        if (result.success && result.data) {
          setActivePhase(result.data.activePhase);
          
          // Format the registrationStart date for the System Locked screen
          if (result.data.timeline && result.data.timeline.registrationStart) {
            const dateObj = new Date(result.data.timeline.registrationStart);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            }) + " @ " + dateObj.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true
            });
            setUnlockDate(formattedDate);
          }
        } else {
          setActivePhase('registration');
        }
      } catch (error) {
        console.error("Failed to fetch system state:", error);
        setActivePhase('registration');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentSystemState();

    // Poll every 15 seconds to instantly sync with Admin changes without needing a page refresh
    const interval = setInterval(fetchCurrentSystemState, 15000);
    return () => clearInterval(interval);
  }, []);

  // Show a loading skeleton while waiting for the database
  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-10 min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-purple-400 font-mono text-sm tracking-widest uppercase">Syncing Overseer Link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 scroll-mt-24" id="portal">

      {/* 1. Dynamic Portal Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 uppercase tracking-tight mb-4">
          {activePhase === "registration" && "Team Registration"}
          {activePhase === "problem_selection" && "Problem Selection"}
          {activePhase === "ppt_submission" && "Project Submission"}
          {activePhase === "final_round" && "Live Final Round"}
          {activePhase === "winners" && "Official Results"}
          {activePhase === "locked" && "System Locked"}
        </h2>
        
        {/* Countdown Timer (Hidden on specific phases) */}
        {activePhase !== "final_round" && activePhase !== "winners" && activePhase !== "locked" && (
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
        
        {/* Locked Phase automatically pulls the start date from the Timeline DB */}
        {activePhase === "locked" && (
          <LockedPhase 
            phaseName="Registration" 
            unlockDate={unlockDate} 
          />
        )}
      </div>

    </div>
  );
}