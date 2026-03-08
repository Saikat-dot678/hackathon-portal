import type { Metadata } from "next";
import Navbar from "@/components/static/Navbar";
import Footer from "@/components/static/Footer";
import Particles from "@/components/ui/Particles";
import "./globals.css";

export const metadata: Metadata = {
  title: "BURNBRAIN Hackathon",
  description: "Ignite your intellect. The ultimate hackathon experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-black text-slate-50 flex flex-col font-sans selection:bg-purple-500 selection:text-white antialiased relative">
        
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

        {/* Main Content Wrapper */}
        <div className="relative z-10 flex flex-col min-h-screen w-full">
          <Navbar />
          
          <main className="flex-grow flex flex-col items-center justify-start w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            {children}
          </main>

          <Footer />
        </div>
        
      </body>
    </html>
  );
}