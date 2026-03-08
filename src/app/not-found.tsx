import Link from "next/link";
import Navbar from "@/components/static/Navbar";
import Footer from "@/components/static/Footer";
import Particles from "@/components/ui/Particles";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-slate-50 flex flex-col font-sans selection:bg-purple-500 selection:text-white antialiased relative">
      
      {/* Particle Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <Particles
          particleCount={300}
          particleSpread={10}
          speed={0.05}
          particleColors={["#ffffff", "#ffffff", "#ffffff"]}
          moveParticlesOnHover={true}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Navbar />
        
        <main className="flex-grow flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 text-center relative">
          
          {/* Ambient Error Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-600/20 blur-[120px] pointer-events-none"></div>

          <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-purple-600 tracking-tighter mb-4 animate-pulse drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-4">
            <span className="h-px w-8 bg-red-500"></span>
            Neural Link Severed
            <span className="h-px w-8 bg-red-500"></span>
          </h2>
          <p className="text-slate-400 max-w-md mb-10 font-mono text-sm leading-relaxed">
            The sector you are attempting to access does not exist, has been redacted, or you lack the required clearance level.
          </p>

          <Link href="/" className="px-8 py-4 bg-black border border-purple-500/50 hover:bg-purple-900/30 hover:border-purple-400 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] uppercase tracking-widest flex items-center gap-3">
            <span>←</span> Return to Base
          </Link>
          
        </main>

        <Footer />
      </div>
    </div>
  );
}