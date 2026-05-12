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
  const [timeline, setTimeline] = useState<any>(null);
  const [unlockDate, setUnlockDate] = useState<string>("TBD");
  const [loading, setLoading] = useState(true);

  // Dynamic Countdown States
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });
  const [countdownLabel, setCountdownLabel] = useState("Phase Ends In");

  // 1. Fetch the live phase and timeline from the database
  useEffect(() => {
    const fetchCurrentSystemState = async () => {
      try {
        const res = await fetch('/api/system', { cache: 'no-store' });
        const result = await res.json();
        
        if (result.success && result.data) {
          setActivePhase(result.data.activePhase);
          
          if (result.data.timeline) {
            setTimeline(result.data.timeline);
            
            // Format the unlock date for the LockedPhase component
            if (result.data.timeline.registrationStart) {
              const dateObj = new Date(result.data.timeline.registrationStart);
              const formattedDate = dateObj.toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric"
              }) + " @ " + dateObj.toLocaleTimeString("en-US", {
                hour: "numeric", minute: "2-digit", hour12: true
              });
              setUnlockDate(formattedDate);
            }
          }
        } else {
          setActivePhase('registration');
        }
      } catch (error) {
        console.error("Failed to fetch system state:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentSystemState();

    // Poll every 15 seconds to sync with Admin changes instantly
    const interval = setInterval(fetchCurrentSystemState, 15000);
    return () => clearInterval(interval);
  }, []);

  // 2. Master Countdown Timer Logic
  useEffect(() => {
    if (!timeline || !activePhase) return;

    let targetDateString = "";

    // Determine what we are counting down towards based on the current phase
    switch (activePhase) {
      case "locked":
        targetDateString = timeline.registrationStart;
        setCountdownLabel("System Unlocks In");
        break;
      case "registration":
        targetDateString = timeline.registrationEnd;
        setCountdownLabel("Registration Closes In");
        break;
      case "problem_selection":
        targetDateString = timeline.problemSelectionEnd;
        setCountdownLabel("Selection Locks In");
        break;
      case "ppt_submission":
        targetDateString = timeline.pptSubmissionEnd;
        setCountdownLabel("Submissions Close In");
        break;
      default:
        return; // Final round and Winners handle their own timing
    }

    if (!targetDateString) return;

    const targetDate = new Date(targetDateString).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: d.toString().padStart(2, '0'),
          hours: h.toString().padStart(2, '0'),
          minutes: m.toString().padStart(2, '0'),
          seconds: s.toString().padStart(2, '0')
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activePhase, timeline]);

  // Loading Skeleton
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
        
        {/* Dynamic Global Countdown Timer */}
        {activePhase !== "final_round" && activePhase !== "winners" && (
          <div className="mt-8">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">{countdownLabel}</h4>
            <div className="flex justify-center gap-3 sm:gap-6 text-center">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Mins", value: timeLeft.minutes },
                { label: "Secs", value: timeLeft.seconds },
              ].map((time, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-900/80 border border-purple-500/30 rounded-xl flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 w-full h-1/2 bg-white/5 border-b border-black/50"></div>
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono z-10">{time.value}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-purple-400 mt-2 uppercase tracking-widest font-bold">{time.label}</span>
                </div>
              ))}
            </div>
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
        {activePhase === "locked" && <LockedPhase phaseName="Registration" unlockDate={unlockDate} />}
      </div>

    </div>
  );
}