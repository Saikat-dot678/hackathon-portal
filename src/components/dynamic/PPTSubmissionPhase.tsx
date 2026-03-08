"use client";

import { motion } from "framer-motion";

export default function PPTSubmissionPhase() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900/60 border border-purple-900/50 p-6 md:p-10 rounded-2xl backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.1)]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Guidelines Column */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 border-b border-purple-900/50 pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span> Submission Guidelines
          </h3>
          <ul className="space-y-4 text-slate-300 text-sm mb-6">
            <li className="flex items-start gap-2"><span className="text-purple-500">▹</span> Download the official PPT template from the portal.</li>
            <li className="flex items-start gap-2"><span className="text-purple-500">▹</span> Maximum limit is 10 slides.</li>
            <li className="flex items-start gap-2"><span className="text-purple-500">▹</span> File must be in .PDF or .PPTX format (Max 15MB).</li>
            <li className="flex items-start gap-2"><span className="text-purple-500">▹</span> Must include: Architecture, Tech Stack, and Expected Impact.</li>
          </ul>
          <button className="text-purple-400 hover:text-white text-sm font-bold flex items-center gap-2 transition-colors">
            ↓ Download Official Template.pptx
          </button>
        </div>

        {/* Upload Column */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 border-b border-purple-900/50 pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span> Upload Document
          </h3>
          
          <div className="w-full border-2 border-dashed border-purple-900/50 hover:border-purple-500/50 bg-black/30 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors">
               <span className="text-2xl">📁</span>
            </div>
            <p className="text-white font-bold mb-1">Click to upload or drag and drop</p>
            <p className="text-slate-500 text-xs">PDF or PPTX (MAX. 15MB)</p>
          </div>

          <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] uppercase tracking-wide border border-purple-500/50">
            Submit Presentation
          </button>
        </div>

      </div>
    </motion.div>
  );
}