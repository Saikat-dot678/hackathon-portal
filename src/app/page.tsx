import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import DynamicEventSection from "@/components/dynamic/DynamicEventSection"; // <-- Import the new section

export default function Home() {
  return (
    <div className="w-full flex flex-col gap-24 py-10 mt-10 overflow-hidden">
      
      {/* 1. HERO / LANDING SECTION */}
      <section id="home" className="flex flex-col items-center justify-center text-center pt-10 pb-20 border-b border-purple-900/30">
        <div className="inline-block mb-4 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(168,85,247,0.2)]">
          Official Launch Phase
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500">
            BURN
          </span>
          <span className="text-white">BRAIN</span>
        </h1>
        <p className="max-w-2xl text-lg text-slate-400 mb-8">
          The ultimate crucible for developers. Push your limits, ignite your intellect, and build relentless solutions in this high-stakes hackathon.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-slate-300 mb-10 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-purple-500">{`/>`}</span> Oct 15 - 17, 2025
          </div>
          <div className="hidden sm:block text-slate-600">|</div>
          <div className="flex items-center gap-2">
            <span className="text-purple-500">{`/>`}</span> Main Campus Auditorium
          </div>
        </div>

        {/* Updated this button to scroll directly down to the portal! */}
        <a href="#portal" className="bg-purple-600 hover:bg-purple-500 text-white text-lg font-bold py-4 px-10 rounded-md transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_35px_rgba(147,51,234,0.6)] transform hover:-translate-y-1 uppercase tracking-wide border border-purple-500/50">
          Enter Portal
        </a>
      </section>

      

      {/* 2. ANNOUNCEMENT & OVERVIEW SECTION */}
      <ScrollReveal>
        <section id="announcements" className="scroll-mt-24">
          <h2 className="text-3xl font-black text-slate-100 mb-8 flex items-center gap-3 uppercase tracking-tight">
            <span className="h-px w-8 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span> Announcements & Rules
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-neutral-900/50 border border-purple-900/50 hover:border-purple-500/40 transition-colors rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-purple-400 mb-4 uppercase tracking-wide">Team Structure</h3>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-start gap-2"><span className="text-fuchsia-500 mt-1">▹</span> Minimum team size: 2 members</li>
                <li className="flex items-start gap-2"><span className="text-fuchsia-500 mt-1">▹</span> Maximum team size: 4 members</li>
                <li className="flex items-start gap-2"><span className="text-fuchsia-500 mt-1">▹</span> Open to all current university students</li>
                <li className="flex items-start gap-2"><span className="text-fuchsia-500 mt-1">▹</span> Team leader is responsible for all portal submissions</li>
              </ul>
            </div>

            <div className="bg-neutral-900/50 border border-purple-900/50 hover:border-purple-500/40 transition-colors rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-purple-400 mb-4 uppercase tracking-wide">Technical Domains</h3>
              <div className="flex flex-wrap gap-3">
                {['Artificial Intelligence', 'Web Development', 'Internet of Things', 'Open Innovation', 'Cybersecurity'].map((domain) => (
                  <span key={domain} className="px-3 py-1 bg-black text-slate-300 rounded-md text-sm border border-purple-900/50 shadow-inner font-medium">
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 3. MASTER TIMELINE SECTION */}
      <section className="scroll-mt-24">
        <ScrollReveal>
          <h2 className="text-3xl font-black text-slate-100 mb-12 text-center uppercase tracking-tight">Event Timeline</h2>
        </ScrollReveal>
        
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-900/0 via-purple-500/50 to-purple-900/0 transform md:-translate-x-1/2 shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
          
          {[
            { phase: "Registration Begins", date: "Sept 1, 2025", desc: "Portal opens for team formation." },
            { phase: "Problem Selection", date: "Sept 20, 2025", desc: "Select your track. First-come, first-serve." },
            { phase: "PPT Submission", date: "Oct 5, 2025", desc: "Submit your solution architecture and approach." },
            { phase: "Final Round (Live)", date: "Oct 15, 2025", desc: "48-hour offline building phase begins." },
          ].map((item, index) => (
            <ScrollReveal key={index} delay={index * 0.15}>
              <div className={`relative flex items-center justify-between mb-8 md:mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="hidden md:block w-5/12"></div>
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-purple-500 rounded-full transform -translate-x-1.5 md:-translate-x-1.5 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                <div className="ml-12 md:ml-0 w-full md:w-5/12 bg-neutral-900/80 border border-purple-900/50 p-5 rounded-lg hover:border-purple-500/60 transition-colors backdrop-blur-sm">
                  <span className="text-fuchsia-400 text-sm font-mono font-bold">{item.date}</span>
                  <h4 className="text-lg font-bold text-slate-100 mt-1">{item.phase}</h4>
                  <p className="text-sm text-slate-400 mt-2">{item.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. DYNAMIC EVENT SECTION (Registration, Problem Selection, etc.) */}
      <ScrollReveal>
        <DynamicEventSection />
      </ScrollReveal>

      {/* 5. SPONSORS SECTION */}
      <ScrollReveal>
        <section id="sponsors" className="scroll-mt-24 text-center">
          <h2 className="text-3xl font-black text-slate-100 mb-8 uppercase tracking-tight">Backed By The Best</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-neutral-900/50 border border-purple-900/30 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 cursor-pointer hover:border-purple-500/40 backdrop-blur-sm">
                <span className="text-slate-500 font-mono text-xl font-bold">Sponsor {i}</span>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>
      
      {/* 6. ORGANIZERS SECTION (Club Version) */}
      <ScrollReveal>
        <section id="organizers" className="scroll-mt-24 text-center">
          <h2 className="text-3xl font-black text-slate-100 mb-10 uppercase tracking-tight flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
            Organized By
            <span className="h-px w-12 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
          </h2>
          
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
            {[
              { 
                name: "CSE Students' Society", 
                role: "Lead Organizer", 
                shortName: "DEV",
                desc: "The official society for Computer Science & Engineering and Mathematics & Computing students at NIT Durgapur." 
              },
              
            ].map((club, i) => (
              <div key={i} className="flex-1 bg-neutral-900/40 border border-purple-900/40 rounded-3xl p-8 md:p-10 flex flex-col items-center hover:border-purple-500/50 hover:bg-purple-900/20 transition-all backdrop-blur-sm group shadow-lg">
                
                {/* Club Logo Placeholder - Smooth rounded square */}
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-black border border-purple-500/30 mb-6 overflow-hidden group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center group-hover:scale-105 duration-500">
                  {/* Replace this span with an <img src="/your-club-logo.png" /> later */}
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-fuchsia-600 font-black text-4xl tracking-tighter">
                    {club.shortName}
                  </span>
                </div>
                
                <p className="text-sm text-fuchsia-400 font-bold uppercase tracking-widest mb-2">{club.role}</p>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-tight">{club.name}</h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm">
                  {club.desc}
                </p>
                
                {/* Optional: Link to club website or socials */}
                <button className="mt-6 text-purple-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                  Visit Website <span>↗</span>
                </button>

              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 7. CONTACT SECTION */}
      <ScrollReveal>
        <section id="contact" className="scroll-mt-24 mb-10">
          <div className="bg-gradient-to-b from-neutral-900/80 to-black border border-purple-900/50 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-purple-600/10 blur-[100px] pointer-events-none"></div>
            
            <h2 className="text-3xl font-black text-slate-100 mb-4 uppercase tracking-tight relative z-10">Need Assistance?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto relative z-10">
              Have questions about the tracks, eligibility, or rules? Our organizing team is here to help you out.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10">
              <a href="mailto:support@burnbrain.com" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors">
                <span>✉</span> support@burnbrain.com
              </a>
              <div className="hidden sm:block text-slate-700">|</div>
              <a href="#" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors">
                <span>💬</span> Join Discord Server
              </a>
            </div>
          </div>
        </section>
      </ScrollReveal>

      

    </div>
  );
}