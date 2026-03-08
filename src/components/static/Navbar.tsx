"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-6 w-full flex justify-center z-50 px-4 pointer-events-none">
      
      {/* Changed 'rounded-2xl' to 'rounded-full' here to make the ends completely round.
      */}
      <nav 
        className={`w-full max-w-7xl transition-all duration-300 rounded-full border pointer-events-auto ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-xl border-purple-500/40 shadow-[0_8px_32px_rgba(168,85,247,0.2)] py-1' 
            : 'bg-white/5 backdrop-blur-md border-white/10 shadow-lg py-2'
        }`}
      >
        <div className="px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo */}
            <div className="flex-shrink-0">
              <Link 
                href="/" 
                onClick={closeMenu}
                className="text-2xl font-black tracking-tighter"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-600">
                  BURN
                </span>
                <span className="text-white">BRAIN</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#announcements" className="text-sm font-medium text-slate-300 hover:text-purple-400 transition-colors uppercase tracking-wider">
                Announcements
              </Link>
              <Link href="#sponsors" className="text-sm font-medium text-slate-300 hover:text-purple-400 transition-colors uppercase tracking-wider">
                Sponsors
              </Link>
              <Link href="#organizers" className="text-sm font-medium text-slate-300 hover:text-purple-400 transition-colors uppercase tracking-wider">
                Organizers
              </Link>
              <Link href="#contact" className="text-sm font-medium text-slate-300 hover:text-purple-400 transition-colors uppercase tracking-wider">
                Contact
              </Link>
            </div>

            {/* Right Side: Round Icon & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              
              {/* BurnBrain Round Icon */}
              <button className="group relative flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 p-[2px] shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] transition-all transform hover:scale-105">
                <div className="h-full w-full bg-black rounded-full flex items-center justify-center transition-colors group-hover:bg-purple-900/20 overflow-hidden">
                  <span className="text-white font-black text-sm tracking-tighter">BB</span>
                </div>
              </button>
              
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-slate-300 hover:text-purple-400 focus:outline-none transition-colors"
                  aria-label="Toggle menu"
                >
                  {isOpen ? (
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-black/95 border border-purple-900/50 rounded-3xl mt-4 overflow-hidden backdrop-blur-xl shadow-[0_8px_32px_rgba(168,85,247,0.2)] mx-2">
            <div className="px-4 pt-4 pb-6 flex flex-col space-y-4">
              <Link href="#announcements" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-purple-900/30 transition-colors uppercase tracking-wide">
                Announcements
              </Link>
              <Link href="#sponsors" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-purple-900/30 transition-colors uppercase tracking-wide">
                Sponsors
              </Link>
              <Link href="#organizers" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-purple-900/30 transition-colors uppercase tracking-wide">
                Organizers
              </Link>
              <Link href="#contact" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-purple-900/30 transition-colors uppercase tracking-wide">
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}