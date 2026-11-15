"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import { BrandLogo } from "@/components/brand-logo";
import type { SocialPlatform } from "@/config/socialLinks";

export function SocialBubble({
  social,
  index,
  decorative = false,
}: {
  social: SocialPlatform;
  index: number;
  decorative?: boolean;
}) {
  const bubbleRef = useRef<HTMLAnchorElement>(null);
  const style = {
    "--bubble-color": social.brandColor,
    "--bubble-size": `${social.bubbleSize}px`,
    "--float-duration": `${5.4 + index * 0.65}s`,
    "--float-delay": `${social.floatDelay}s`,
  } as CSSProperties;

  function moveBubble(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty("--tilt-x", `${-y * 8}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${x * 9}deg`);
  }

  function resetBubble() {
    bubbleRef.current?.style.setProperty("--tilt-x", "0deg");
    bubbleRef.current?.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <a
      ref={bubbleRef}
      className={`social-bubble social-bubble-${social.id} social-bubble-size-${social.bubbleSize}`}
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open Mamun Reja's ${social.name} profile in a new tab`}
      aria-hidden={decorative}
      tabIndex={decorative ? -1 : undefined}
      style={style}
      onPointerMove={moveBubble}
      onPointerLeave={resetBubble}
      onPointerCancel={resetBubble}
    >
      <span className="social-bubble-orb">
        <BrandLogo name={social.icon} className="social-bubble-logo" />
      </span>
      <span className="social-bubble-label">{social.name}</span>
    </a>
  );
}
