import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TargetCursor from "@/components/ui/TargetCursor"; 
import Particles from "@/components/ui/Particles"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BURNBRAIN Hackathon",
  description: "The ultimate crucible for developers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {/* Global cursor applied to everything */}
        <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn hoverDuration={0.2} />

        {/* Particle Background - Pure White Particles on Black Background */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-70">
          <Particles
            particleCount={500}
            particleSpread={10}
            speed={0.1}
            particleColors={["#ffffff", "#ffffff", "#ffffff"]} // Forced pure white
            moveParticlesOnHover={true}
          />
        </div>
        
        {/* NO NAVBAR OR FOOTER HERE ANYMORE! */}
        {children}
        
      </body>
    </html>
  );
}