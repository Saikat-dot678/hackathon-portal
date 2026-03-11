"use client";

import { useState, useEffect } from "react";

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // If the user scrolls down more than 50 pixels, hide the arrow
      if (window.scrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce transition-opacity duration-500 ${
        isVisible ? "opacity-70" : "opacity-0 pointer-events-none"
      }`}
    >
      <span className="text-xs text-purple-400 font-mono uppercase tracking-widest mb-2">
        Scroll to Hack
      </span>
      <svg className="w-6 h-6 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
      </svg>
    </div>
  );
}