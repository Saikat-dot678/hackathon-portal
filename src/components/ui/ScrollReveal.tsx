"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
}

export default function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  return (
    <motion.div
      // Start slightly pushed down and completely transparent
      initial={{ opacity: 0, y: 40 }}
      // Animate to full opacity and original position when in view
      whileInView={{ opacity: 1, y: 0 }}
      // Trigger animation once when the element is 100px away from the bottom of the viewport
      viewport={{ once: false, margin: "-100px" }}
      // Smooth easing curve
      transition={{ duration: 1.2, delay: delay, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}