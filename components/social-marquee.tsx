"use client";

import { useEffect, useRef, useState } from "react";
import { SocialBubble } from "@/components/social-bubble";
import { socialLinks, type SocialAnimationRow } from "@/config/socialLinks";

const rows: readonly { id: SocialAnimationRow; label: string }[] = [
  { id: 1, label: "Social profiles moving left to right" },
  { id: 2, label: "Social profiles moving right to left" },
];

export function SocialMarquee() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    if (!("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.08, rootMargin: "48px 0px" });

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={stageRef} className={`social-marquee-stage${isInView ? " is-in-view" : ""}`}>
      {rows.map((row) => {
        const rowLinks = socialLinks.filter((social) => social.animationRow === row.id);
        return (
          <div className={`social-marquee-row social-marquee-row-${row.id}`} key={row.id} role="group" aria-label={row.label}>
            <div className="social-marquee-window">
              <div className={`social-marquee-track social-marquee-track-${row.id}`}>
                {[0, 1, 2].map((copy) => (
                  <div className="social-marquee-group" key={copy} aria-hidden={copy > 0}>
                    {rowLinks.map((social, index) => (
                      <SocialBubble key={social.id} social={social} index={index} decorative={copy > 0} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
