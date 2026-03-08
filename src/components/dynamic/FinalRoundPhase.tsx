"use client";

import { motion } from "framer-motion";

export default function FinalRoundPhase() {
  const stages = [
    { id: "opening", name: "Opening Ceremony", status: "completed" },
    { id: "mentoring_1", name: "Mentoring Session 1", status: "completed" },
    { id: "mentoring_2", name: "Mentoring Session 2", status: "active" },
    { id: "judge_review", name: "Judge Review", status: "locked" },
    { id: "final_judging", name: "Final Judging Round", status: "locked" },
    { id: "winners", name: "Winner Announcement", status: "locked" },
  ];

  const panels = [
    {
      name: "Alpha Panel",
      judges: ["Dr. Sarah Chen (AI Lead)", "Marcus V. (Security Architect)"],
      schedule: [
        { time: "10:00 AM", team: "Cyber Ninjas" },
        { time: "10:25 AM", team: "Neural Nomads" },
        { time: "10:50 AM", team: "Logic Bombers" },
      ]
    },
    {
      name: "Omega Panel",
      judges: ["Elena Rostova (IoT Expert)", "David Kim (CTO, TechCorp)"],
      schedule: [
        { time: "10:00 AM", team: "Byte Busters" },
        { time: "10:25 AM", team: "Quantum Quacks" },
        { time: "10:50 AM", team: "Zero Day Heroes" },
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      
      {/* Top Section: Live Stage & Mini Timeline */}
      <div className="bg-neutral-900/60 border border-purple-900/50 p-6 md:p-10 rounded-3xl backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.1)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-purple-900/50 pb-8">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-fuchsia-500"></span>
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider">Live Event Status</h3>
            </div>
            <p className="text-purple-400 font-mono text-base text-center md:text-left">
              Next stage begins in: <span className="text-white font-bold text-xl ml-2 tracking-widest">00:45:12</span>
            </p>
          </div>
          
          <div className="px-8 py-4 bg-purple-900/20 border border-purple-500/40 rounded-xl text-center shadow-inner">
            <p className="text-sm text-slate-400 uppercase tracking-widest mb-1 font-bold">Current Stage</p>
            <p className="text-2xl font-black text-white tracking-tight">Mentoring Session 2</p>
          </div>
        </div>

        {/* Horizontal Mini Timeline */}
        {/* THE FIX: Added cross-browser scrollbar hiding classes:
            [scrollbar-width:none] (Firefox) 
            [-ms-overflow-style:none] (IE/Edge)
            [&::-webkit-scrollbar]:hidden (Chrome/Safari)
        */}
        <div className="w-full overflow-x-auto pb-6 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          
          {/* THE FIX: Inner container uses 'min-w-max' so the lines stretch correctly across all items */}
          <div className="relative flex items-start gap-6 md:gap-10 min-w-max px-4">
            
            {/* Connecting Line backgrounds - Now anchored left-8 and right-8 so they stop perfectly at the center of the first/last dots */}
            <div className="absolute left-10 right-10 top-[1.25rem] md:top-[1.5rem] h-1.5 bg-neutral-800 z-0 rounded-full"></div>
            
            {/* Active progress line */}
            <div className="absolute left-10 top-[1.25rem] md:top-[1.5rem] w-[40%] h-1.5 bg-gradient-to-r from-purple-600 to-fuchsia-500 z-0 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.6)]"></div>

            {stages.map((stage) => (
              // Explicit fixed widths (w-32 md:w-40) keep the items perfectly evenly spaced
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

      {/* Bottom Section: Panels & Schedules */}
      <div>
        <h3 className="text-2xl md:text-3xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-4">
          <span className="h-px w-10 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span> Presentation Schedules
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {panels.map((panel, idx) => (
            <div key={idx} className="bg-neutral-900/40 border border-purple-900/40 rounded-3xl overflow-hidden backdrop-blur-sm shadow-lg">
              
              <div className="bg-purple-900/20 border-b border-purple-900/50 p-6 md:p-8">
                <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mb-4">{panel.name}</h4>
                <div className="flex flex-wrap gap-3">
                  {panel.judges.map((judge, jIdx) => (
                    <span key={jIdx} className="text-sm bg-black/50 text-purple-300 px-3 py-1.5 rounded-md border border-purple-800/50 font-bold">
                      {judge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 md:p-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-sm uppercase tracking-widest text-slate-500">
                      <th className="pb-4 pl-4 font-bold">Time</th>
                      <th className="pb-4 font-bold">Team Name</th>
                      <th className="pb-4 text-right pr-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {panel.schedule.map((slot, sIdx) => (
                      <tr key={sIdx} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors group">
                        <td className="py-5 pl-4 text-base font-mono font-bold text-purple-400">{slot.time}</td>
                        <td className="py-5 text-base font-black text-slate-200 group-hover:text-white transition-colors tracking-wide">{slot.team}</td>
                        <td className="py-5 text-right pr-4">
                           <span className={`text-xs px-3 py-1.5 rounded-md font-black uppercase tracking-widest ${
                             sIdx === 0 ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                             sIdx === 1 ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30 animate-pulse' :
                             'bg-neutral-800 text-slate-500'
                           }`}>
                             {sIdx === 0 ? 'Evaluated' : sIdx === 1 ? 'Up Next' : 'Waiting'}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}