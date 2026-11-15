"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

export function ProjectTilt({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    wrapper.classList.add("project-reveal");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        wrapper.classList.add("is-visible");
        observer.unobserve(wrapper);
      }
    }, { threshold: 0.14, rootMargin: "0px 0px -24px 0px" });

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${-y * 3}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${x * 3.5}deg`);
  }
  function reset(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }
  return <div ref={wrapperRef} className="project-tilt-wrap" onPointerMove={move} onPointerLeave={reset}>{children}</div>;
}
