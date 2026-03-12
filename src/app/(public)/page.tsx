import ScrollReveal from "@/components/ui/ScrollReveal";
import HeroSection from "@/components/static/HeroSection";
import DynamicEventSection from "@/components/dynamic/DynamicEventSection";
import Particles from "@/components/ui/Particles";

export default function Home() {
  return (
    // ✨ Changed to relative and bg-black so Particles work correctly
    <div className="w-full relative overflow-hidden bg-black">
      
      {/* Particle Background - Pure White Particles on Black Background */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-70">
          <Particles
            className="w-full h-full"
            particleCount={500}
            particleSpread={10}
            speed={0.1}
            particleColors={["#ffffff", "#ffffff", "#ffffff"]} // Forced pure white
            moveParticlesOnHover={true}
          />
        </div>

      {/* ✨ MAIN CONTENT WRAPPER (z-10 keeps it above particles) */}
      <div className="relative z-10 w-full flex flex-col gap-24 pb-10">
        
        {/* 1. HERO / LANDING SECTION */}
        <HeroSection />

        {/* 2. ANNOUNCEMENT & OVERVIEW SECTION */}
        <ScrollReveal>
          {/* ✨ Aligned to max-w-5xl */}
          <section id="announcements" className="scroll-mt-24 max-w-5xl mx-auto px-6 w-full">
            <h2 className="text-3xl font-black text-slate-100 mb-8 flex items-center gap-3 uppercase tracking-tight">
              <span className="h-px w-8 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span> Announcements & Rules
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-neutral-900/50 border border-purple-900/50 hover:border-purple-500/40 transition-colors rounded-xl p-6 backdrop-blur-sm cursor-target">
                <h3 className="text-xl font-bold text-purple-400 mb-4 uppercase tracking-wide">Team Structure</h3>
                <ul className="space-y-3 text-slate-400">
                  <li className="flex items-start gap-2"><span className="text-fuchsia-500 mt-1">▹</span> Minimum team size: 2 members</li>
                  <li className="flex items-start gap-2"><span className="text-fuchsia-500 mt-1">▹</span> Maximum team size: 4 members</li>
                  <li className="flex items-start gap-2"><span className="text-fuchsia-500 mt-1">▹</span> Open to all current university students</li>
                  <li className="flex items-start gap-2"><span className="text-fuchsia-500 mt-1">▹</span> Team leader is responsible for all portal submissions</li>
                </ul>
              </div>

              <div className="bg-neutral-900/50 border border-purple-900/50 hover:border-purple-500/40 transition-colors rounded-xl p-6 backdrop-blur-sm cursor-target">
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

        {/* 3. PRIZE POOL SECTION */}
        <ScrollReveal>
          {/* ✨ Aligned to max-w-5xl */}
          <section id="prizes" className="scroll-mt-24 text-center relative z-10 max-w-5xl mx-auto px-6 w-full">
            <h2 className="text-3xl md:text-4xl font-black text-slate-100 mb-12 uppercase tracking-tight flex items-center justify-center gap-4">
              <span className="h-px w-8 md:w-16 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
              Prize Pool
              <span className="h-px w-8 md:w-16 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              
              {/* 2nd Place (Left Side) */}
              <div className="md:mt-12 bg-neutral-900/60 border border-slate-400/30 rounded-3xl p-8 backdrop-blur-sm hover:border-slate-400/60 transition-all duration-300 hover:-translate-y-2 shadow-[0_0_30px_rgba(148,163,184,0.1)] hover:shadow-[0_0_40px_rgba(148,163,184,0.2)] order-2 md:order-1 flex flex-col items-center cursor-target">
                <div className="text-5xl md:text-6xl mb-4 drop-shadow-md">🥈</div>
                <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest mb-1">2nd Place</h3>
                <p className="text-4xl font-black text-white mb-6">$2,500</p>
                <ul className="text-sm text-slate-400 space-y-3 text-left w-full border-t border-slate-800 pt-6">
                  <li className="flex items-start gap-2"><span className="text-slate-300">▹</span> Premium Swag Kit</li>
                  <li className="flex items-start gap-2"><span className="text-slate-300">▹</span> Sponsor API Credits</li>
                  <li className="flex items-start gap-2"><span className="text-slate-300">▹</span> Fast-track Interviews</li>
                </ul>
              </div>

              {/* 1st Place (Center - Taller & Glowing) */}
              <div className="relative bg-neutral-900/80 border border-yellow-500/50 rounded-3xl p-10 md:p-12 backdrop-blur-md hover:border-yellow-400 transition-all duration-300 hover:-translate-y-3 shadow-[0_0_50px_rgba(234,179,8,0.2)] hover:shadow-[0_0_60px_rgba(234,179,8,0.3)] order-1 md:order-2 flex flex-col items-center z-20 cursor-target">
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-yellow-500/10 to-transparent rounded-t-3xl pointer-events-none"></div>
                <div className="text-7xl md:text-8xl mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">🥇</div>
                <h3 className="text-xl font-black text-yellow-400 uppercase tracking-widest mb-2">Grand Prize</h3>
                <p className="text-5xl md:text-6xl font-black text-white mb-8">$5,000</p>
                <ul className="text-sm text-slate-300 space-y-4 text-left w-full border-t border-yellow-900/50 pt-6">
                  <li className="flex items-start gap-2 font-bold"><span className="text-yellow-500">▹</span> Flagship Hardware Bundle</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500">▹</span> $1,000 Cloud Credits</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500">▹</span> Mentorship with VCs</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500">▹</span> Exclusive Winner Trophies</li>
                </ul>
              </div>

              {/* 3rd Place (Right Side) */}
              <div className="md:mt-12 bg-neutral-900/60 border border-orange-500/30 rounded-3xl p-8 backdrop-blur-sm hover:border-orange-500/60 transition-all duration-300 hover:-translate-y-2 shadow-[0_0_30px_rgba(249,115,22,0.1)] hover:shadow-[0_0_40px_rgba(249,115,22,0.2)] order-3 flex flex-col items-center cursor-target">
                <div className="text-5xl md:text-6xl mb-4 drop-shadow-md">🥉</div>
                <h3 className="text-lg font-black text-orange-400 uppercase tracking-widest mb-1">3rd Place</h3>
                <p className="text-4xl font-black text-white mb-6">$1,000</p>
                <ul className="text-sm text-slate-400 space-y-3 text-left w-full border-t border-slate-800 pt-6">
                  <li className="flex items-start gap-2"><span className="text-orange-400">▹</span> Standard Swag Kit</li>
                  <li className="flex items-start gap-2"><span className="text-orange-400">▹</span> 1-Year Pro Subscriptions</li>
                  <li className="flex items-start gap-2"><span className="text-orange-400">▹</span> Sponsor Shoutouts</li>
                </ul>
              </div>

            </div>
            
            {/* Special Tracks Pill */}
            <div className="mt-12 inline-block bg-black/50 border border-purple-500/30 px-8 py-4 rounded-full backdrop-blur-sm cursor-target">
              <p className="text-slate-300 font-medium">
                Plus <span className="text-fuchsia-400 font-bold">$1,500+</span> in special track prizes for Best UI/UX & Most Innovative!
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* 4. MASTER TIMELINE SECTION */}
        {/* ✨ Aligned to max-w-5xl */}
        <section className="scroll-mt-24 max-w-5xl mx-auto px-6 w-full">
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

        {/* 5. DYNAMIC EVENT SECTION */}
        <ScrollReveal>
          {/* ✨ Aligned to max-w-5xl */}
          <div className="max-w-5xl mx-auto px-6 w-full">
            <DynamicEventSection />
          </div>
        </ScrollReveal>

        {/* 6. SPONSORS SECTION */}
        <ScrollReveal>
          {/* ✨ Aligned to max-w-5xl */}
          <section id="sponsors" className="scroll-mt-24 text-center max-w-5xl mx-auto px-6 w-full">
            <h2 className="text-3xl font-black text-slate-100 mb-8 uppercase tracking-tight">Backed By The Best</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-neutral-900/50 border border-purple-900/30 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 cursor-pointer hover:border-purple-500/40 backdrop-blur-sm cursor-target">
                  <span className="text-slate-500 font-mono text-xl font-bold">Sponsor {i}</span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
        
        {/* 7. ORGANIZERS SECTION (Club Version) */}
        <ScrollReveal>
          {/* ✨ Aligned to max-w-5xl */}
          <section id="organizers" className="scroll-mt-24 text-center max-w-5xl mx-auto px-6 w-full">
            <h2 className="text-3xl font-black text-slate-100 mb-10 uppercase tracking-tight flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
              Organized By
              <span className="h-px w-12 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
            </h2>
            
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
              {[
                { 
                  name: "CSE Students' Society", 
                  role: "Lead Organizer", 
                  shortName: "DEV",
                  desc: "The official society for Computer Science & Engineering and Mathematics & Computing students at NIT Durgapur." 
                },
                
              ].map((club, i) => (
                <div key={i} className="flex-1 max-w-md mx-auto bg-neutral-900/40 border border-purple-900/40 rounded-3xl p-8 md:p-10 flex flex-col items-center hover:border-purple-500/50 hover:bg-purple-900/20 transition-all backdrop-blur-sm group shadow-lg cursor-target">
                  
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-black border border-purple-500/30 mb-6 overflow-hidden group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center group-hover:scale-105 duration-500">
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-fuchsia-600 font-black text-4xl tracking-tighter">
                      {club.shortName}
                    </span>
                  </div>
                  
                  <p className="text-sm text-fuchsia-400 font-bold uppercase tracking-widest mb-2">{club.role}</p>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-tight">{club.name}</h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm">
                    {club.desc}
                  </p>
                  
                  <button className="mt-6 text-purple-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                    Visit Website <span>↗</span>
                  </button>

                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 8. CONTACT SECTION */}
        <ScrollReveal>
          {/* ✨ Aligned to max-w-5xl */}
          <section id="contact" className="scroll-mt-24 mb-10 max-w-5xl mx-auto px-6 w-full">
            <div className="bg-gradient-to-b from-neutral-900/80 to-black border border-purple-900/50 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden backdrop-blur-sm cursor-target">
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
    </div>
  );
}