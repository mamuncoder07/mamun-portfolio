"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download, Sparkles } from "lucide-react";
import { ProfileImage } from "@/components/profile-image";
import { portfolio } from "@/config/portfolio";

const heroHighlights = [
  { value: "04", label: "Projects in view" },
  { value: "AI/ML", label: "Primary focus" },
  { value: "∞", label: "Always learning" },
] as const;

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setRoleIndex((current) => (current + 1) % portfolio.roles.length), 3200);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title">
      <div className="hero-layout page-width">
        <motion.div
          className="hero-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.2, 0.65, 0.3, 1] }}
        >
          <h1 id="hero-title">Hello, I&apos;m<br /><em>Mamun Reja</em></h1>
          <p className="hero-designation">AI/ML Engineer <span aria-hidden="true">|</span> Data Scientist</p>
          <p className="hero-description">{portfolio.heroCopy}</p>
          <p className="hero-exploration"><Sparkles size={14} aria-hidden="true" /><span className="hero-exploration-label">Currently exploring:</span><span className="hero-exploration-topics">Machine learning <i>•</i> Data science <i>•</i> AI</span></p>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">Explore My Projects <ArrowUpRight size={16} aria-hidden="true" /></a>
            <a className="button button-ghost" href="#contact">Let&apos;s Connect <ArrowRight size={15} aria-hidden="true" /></a>
            <a className="button button-resume" href="/resume/Mamun_Reja_Resume.pdf?v=8BE901BC" download="Mamun_Reja_Resume.pdf">
              Download Resume <Download size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-highlights" aria-label="Portfolio highlights">
            {heroHighlights.map((highlight) => (
              <div className="hero-highlight" key={highlight.label}>
                <strong>{highlight.value}</strong>
                <span>{highlight.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="hero-art"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.85, delay: reduceMotion ? 0 : 0.12, ease: [0.2, 0.65, 0.3, 1] }}
        >
          <div className="clay-shapes" aria-hidden="true"><span className="clay-ball clay-ball-a" /><span className="clay-ball clay-ball-b" /><span className="clay-ball clay-ball-c" /><span className="clay-ring" /><span className="clay-pill" /></div>
          <ProfileImage variant="hero" priority />
          <span className="hero-photo-glass-tag" aria-hidden="true">Mamun Reja&nbsp; / &nbsp;<AnimatePresence mode="wait" initial={false}><motion.span key={roleIndex} initial={reduceMotion ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -4 }} transition={{ duration: reduceMotion ? 0 : .2 }}>{portfolio.roles[roleIndex]}</motion.span></AnimatePresence></span>
        </motion.div>
      </div>
    </section>
  );
}
