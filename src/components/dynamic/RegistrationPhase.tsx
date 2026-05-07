"use client";

import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import { useState } from "react";

export default function RegistrationPhase() {
  const [formData, setFormData] = useState({
    name: "",
    leaderName: "",
    email: "",
    phone: "",
    institution: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state for theme-friendly feedback

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true); // Switch to success view instead of alert
      } else {
        alert("Error: " + result.error); // Keep alert only for errors
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900/60 border border-purple-900/50 p-6 md:p-10 rounded-2xl backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.1)] min-h-[400px] flex flex-col justify-center"
    >
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form 
            key="registration-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8" 
            onSubmit={handleSubmit}
          >
            {/* Team Details */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 border-b border-purple-900/50 pb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span> Team Identity
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Team Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Cyber Ninjas" 
                    className="w-full bg-black/50 border border-purple-900/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" 
                    required
                  />
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
                  <input 
                    type="text" 
                    name="leaderName"
                    value={formData.leaderName}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-purple-900/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-purple-900/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-purple-900/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Institution</label>
                  <input 
                    type="text" 
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-purple-900/50 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" 
                  />
                </div>
              </div>
            </div>

            {/* Rules & Submission */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-purple-900/50">
              <label className="flex items-center gap-3 text-sm text-slate-400 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 rounded border-purple-900/50 bg-black/50 text-purple-500 focus:ring-purple-500 focus:ring-offset-black" />
                <span>I agree to the <a href="#announcements" className="text-purple-400 hover:text-purple-300 underline">Hackathon Rules</a> and guidelines.</span>
              </label>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] uppercase tracking-wide border border-purple-500/50 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Submit Registration"}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            key="success-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/20 border border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <span className="text-4xl text-purple-400">✓</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tighter uppercase">Registration Successful</h2>
              <p className="text-slate-400 text-lg">Welcome to the arena, <span className="text-purple-400 font-semibold">{formData.name}</span>.</p>
            </div>
            <p className="text-sm text-slate-500 italic">Check your dashboard for upcoming phases.</p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="mt-4 text-purple-400 hover:text-purple-300 underline text-sm transition-colors"
            >
              Register another team
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}