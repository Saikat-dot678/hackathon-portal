"use client";

import { useEffect, useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function MasterTimeline() {
  const [timeline, setTimeline] = useState([
    { phase: "Registration Begins", date: "Loading...", desc: "Portal opens for team formation." },
    { phase: "Problem Selection", date: "Loading...", desc: "Select your track. First-come, first-serve." },
    { phase: "PPT Submission", date: "Loading...", desc: "Submit your solution architecture and approach." },
    { phase: "Final Round (Live)", date: "Loading...", desc: "48-hour offline building phase begins." },
  ]);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch("/api/system");
        const result = await res.json();
        
        if (result.success && result.data && result.data.timeline) {
          const t = result.data.timeline;
          
          // Helper to format ISO dates into "Sept 1, 2026"
          const formatDate = (dateString: string) => {
            if (!dateString) return "TBD";
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          };

          setTimeline([
            { phase: "Registration Begins", date: formatDate(t.registrationStart), desc: "Portal opens for team formation." },
            { phase: "Problem Selection", date: formatDate(t.problemSelectionStart), desc: "Select your track. First-come, first-serve." },
            { phase: "PPT Submission", date: formatDate(t.pptSubmissionStart), desc: "Submit your solution architecture and approach." },
            { phase: "Final Round (Live)", date: formatDate(t.finalRoundDate), desc: "48-hour offline building phase begins." },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch timeline dates:", error);
      }
    };

    fetchTimeline();
  }, []);

  return (
    <section className="scroll-mt-24 max-w-5xl mx-auto px-6 w-full">
      <ScrollReveal>
        <h2 className="text-3xl font-black text-slate-100 mb-12 text-center uppercase tracking-tight">Event Timeline</h2>
      </ScrollReveal>
      
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-900/0 via-purple-500/50 to-purple-900/0 transform md:-translate-x-1/2 shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
        
        {timeline.map((item, index) => (
          <ScrollReveal key={index} delay={index * 0.15}>
            <div className={`relative flex items-center justify-between mb-8 md:mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="hidden md:block w-5/12"></div>
              <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-purple-500 rounded-full transform -translate-x-1.5 md:-translate-x-1.5 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
              <div className="ml-12 md:ml-0 w-full md:w-5/12 bg-neutral-900/80 border border-purple-900/50 p-5 rounded-lg hover:border-purple-500/60 transition-colors backdrop-blur-sm cursor-target">
                <span className="text-fuchsia-400 text-sm font-mono font-bold">{item.date}</span>
                <h4 className="text-lg font-bold text-slate-100 mt-1">{item.phase}</h4>
                <p className="text-sm text-slate-400 mt-2">{item.desc}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}