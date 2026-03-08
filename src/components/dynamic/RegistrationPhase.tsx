"use client";

import { motion } from "framer-motion";

export default function RegistrationPhase() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900/60 border border-purple-900/50 p-6 md:p-10 rounded-2xl backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.1)]"
    >
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        
        {/* Team Details */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 border-b border-purple-900/50 pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span> Team Identity
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Team Name</label>
              <input type="text" placeholder="e.g. Cyber Ninjas" className="w-full bg-black/50 border border-purple-900/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* Leader Details */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 border-b border-purple-900/50 pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span> Leader Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input type="text" className="w-full bg-black/50 border border-purple-900/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input type="email" className="w-full bg-black/50 border border-purple-900/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
              <input type="tel" className="w-full bg-black/50 border border-purple-900/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Institution</label>
              <input type="text" className="w-full bg-black/50 border border-purple-900/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* Rules & Submission */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-purple-900/50">
          <label className="flex items-center gap-3 text-sm text-slate-400 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 rounded border-purple-900/50 bg-black/50 text-purple-500 focus:ring-purple-500 focus:ring-offset-black" />
            <span>I agree to the <a href="#announcements" className="text-purple-400 hover:text-purple-300 underline">Hackathon Rules</a> and guidelines.</span>
          </label>
          
          <button type="button" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] uppercase tracking-wide border border-purple-500/50">
            Submit Registration
          </button>
        </div>

      </form>
    </motion.div>
  );
}