import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-purple-900/50 pt-16 pb-8 mt-20 relative z-10">
      {/* Subtle background glow for the footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          {/* 1. Brand Section (Takes up more space on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="text-3xl font-black tracking-tighter inline-block mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-600">
                BURN
              </span>
              <span className="text-white">BRAIN</span>
            </Link>
            <p className="text-slate-400 text-sm md:text-base max-w-sm font-mono leading-relaxed">
              Build. Innovate. Disrupt. <br />
              The ultimate crucible for developers. Push your limits and build relentless solutions.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li><Link href="/" className="hover:text-purple-400 transition-colors">Home</Link></li>
              <li><Link href="#announcements" className="hover:text-purple-400 transition-colors">Announcements</Link></li>
              <li><Link href="#timeline" className="hover:text-purple-400 transition-colors">Schedule & Timeline</Link></li>
              <li><Link href="#announcements" className="hover:text-purple-400 transition-colors">Technical Domains</Link></li>
              <li><Link href="#sponsors" className="hover:text-purple-400 transition-colors">Sponsors</Link></li>
            </ul>
          </div>

          {/* 3. Resources */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span> Resources
            </h4>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li><Link href="#" className="hover:text-fuchsia-400 transition-colors">Hackathon Rules</Link></li>
              <li><Link href="#" className="hover:text-fuchsia-400 transition-colors">Code of Conduct</Link></li>
              <li><Link href="#" className="hover:text-fuchsia-400 transition-colors">Submission Guide</Link></li>
              <li><Link href="#" className="hover:text-fuchsia-400 transition-colors">PPT Template</Link></li>
            </ul>
          </div>

          {/* 4. Community & Sponsors (Combined column for balance) */}
          <div className="space-y-8">
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span> Community
              </h4>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li><a href="#" className="hover:text-pink-400 transition-colors">Discord Server</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Top Sponsors</h4>
              <ul className="flex flex-wrap gap-3 text-sm text-slate-400 font-mono">
                <li className="bg-neutral-900 border border-purple-900/50 px-2 py-1 rounded">Google</li>
                <li className="bg-neutral-900 border border-purple-900/50 px-2 py-1 rounded">GitHub</li>
                <li className="bg-neutral-900 border border-purple-900/50 px-2 py-1 rounded">AWS</li>
              </ul>
            </div>
          </div>

        </div>

        {/* 5. Copyright Bar */}
        <div className="pt-8 border-t border-purple-900/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm font-mono">
            © 2026 BURNBRAIN. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm font-mono flex items-center gap-2">
            Built by the <span className="text-purple-400 font-bold">BURNBRAIN Team</span>
          </p>
        </div>
        
      </div>
    </footer>
  );
}