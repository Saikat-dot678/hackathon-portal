"use client"; 

import ScrollIndicator from "@/components/ui/ScrollIndicator";
import SplitText from "@/components/ui/SplitText"; 
import TextType from "@/components/ui/TextType";
import TargetCursor from "@/components/ui/TargetCursor";

export default function HeroSection() {
  return (
    <section id="home" className="relative w-full min-h-screen flex flex-col items-center justify-center text-center border-b border-purple-900/30 px-4">
      
      {/* AMBIENT GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-purple-600/10 blur-[100px] md:blur-[150px] pointer-events-none rounded-full"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="inline-block mb-4 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(168,85,247,0.2)]">
          Official Launch Phase
        </div>
        
        {/* TEXT SCALING WITH UNIFIED GSAP SPLIT TEXT */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 flex items-center justify-center overflow-hidden">
          
          <SplitText
            text="BURNBRAIN"
            tag="span"
            // We set the default text to white, then use nth-child(-n+4) to apply the gradient ONLY to the first 4 letters (B-U-R-N)
            className="pb-2 text-white [&_.split-char:nth-child(-n+4)]:bg-clip-text [&_.split-char:nth-child(-n+4)]:text-transparent [&_.split-char:nth-child(-n+4)]:bg-gradient-to-r [&_.split-char:nth-child(-n+4)]:from-purple-500 [&_.split-char:nth-child(-n+4)]:via-fuchsia-500 [&_.split-char:nth-child(-n+4)]:to-pink-500"
            delay={50}
            duration={1.2}
            from={{ opacity: 0, y: 80 }}
            to={{ opacity: 1, y: 0 }}
          />
          
        </h1>
        
        {/* TERMINAL TYPING EFFECT SUBTITLE */}
        {/* We add min-h-[80px] so the layout doesn't jump around while it types! */}
        <div className="max-w-2xl text-lg md:text-xl text-slate-400 mb-8 px-4 min-h-[80px] md:min-h-[60px] flex items-start justify-center">
          <TextType 
            text="The ultimate crucible for developers. Push your limits, ignite your intellect, and build relentless solutions in this high-stakes hackathon."
            typingSpeed={30} // A bit faster so users don't have to wait too long to read it
            showCursor={true}
            cursorCharacter="_" // Terminal-style underscore cursor
            loop={false} // Keeps the text on screen once finished
            className="font-mono text-base md:text-lg" // Added a monospace font to complete the hacker look
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-slate-300 mb-10 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-purple-500">{`/>`}</span> April 15 - 17, 2026
          </div>
          <div className="hidden sm:block text-slate-600">|</div>
          <div className="flex items-center gap-2">
            <span className="text-purple-500">{`/>`}</span> Main Campus Auditorium
          </div>
        </div>

        {/* Notice the 'cursor-target' added to the end of the classes! */}
        <a href="#portal" className="inline-block bg-purple-600 hover:bg-purple-500 text-white text-lg font-bold py-4 px-10 rounded-md transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_35px_rgba(147,51,234,0.6)] transform hover:-translate-y-1 uppercase tracking-wide border border-purple-500/50 cursor-target">
          Enter Portal
        </a>
      </div>

      {/* SCROLL INDICATOR */}
      <ScrollIndicator />

    </section>
  );
}