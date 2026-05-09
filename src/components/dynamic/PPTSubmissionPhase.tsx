"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PPTSubmissionPhase() {
  const [form, setForm] = useState({ teamName: "", password: "", pptLink: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/teams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.success) {
        setStatus("success");
        setMessage("Your presentation has been successfully secured in the database. No further edits can be made.");
      } else {
        setStatus("error");
        setMessage(result.error || "Failed to submit presentation.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("A network error occurred. Please check your connection and try again.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="bg-fuchsia-900/20 border border-fuchsia-500/30 p-6 rounded-2xl backdrop-blur-md text-center">
        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Project Submission Gateway</h3>
        <p className="text-slate-300 text-sm">
          Submit the link to your final presentation (Google Slides, Canva, or a public Drive link). Ensure the viewing permissions are set to <span className="text-fuchsia-400 font-bold">"Anyone with the link can view"</span>.
        </p>
      </div>

      <div className="bg-neutral-900/60 border border-slate-800 rounded-2xl p-6 md:p-10 backdrop-blur-md shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50"></div>

        {status === "success" ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="text-center py-10"
          >
            <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <span className="text-4xl">✓</span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Link Secured</h3>
            <p className="text-slate-400 mb-8">{message}</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {status === "error" && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm font-bold text-center">
                ⚠ {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Team Name</label>
                <input 
                  type="text" required
                  value={form.teamName}
                  onChange={(e) => setForm({...form, teamName: e.target.value})}
                  className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 transition-all"
                  placeholder="Registered team name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Team Password</label>
                <input 
                  type="password" required
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Presentation URL</label>
              <input 
                type="url" required
                value={form.pptLink}
                onChange={(e) => setForm({...form, pptLink: e.target.value})}
                className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-fuchsia-300 font-mono text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 transition-all"
                placeholder="https://docs.google.com/presentation/d/..."
              />
              <p className="text-xs text-red-400 font-bold mt-2 italic">⚠ Warning: Submissions are final and cannot be edited once saved.</p>
            </div>
            
            <button 
              type="submit" disabled={status === "submitting"}
              className="w-full py-4 mt-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black text-lg uppercase tracking-widest rounded-lg transition-all shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_30px_rgba(192,38,211,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Encrypting & Saving..." : "Final Submit Project"}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}