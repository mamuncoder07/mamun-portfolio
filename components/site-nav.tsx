"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { portfolio } from "@/config/portfolio";
import { ProfileImage } from "@/components/profile-image";

const links = [
  { label: "Home", href: "#home", section: "home" },
  { label: "About", href: "#about", section: "about" },
  { label: "Skills", href: "#skills", section: "skills" },
  { label: "Projects", href: "#projects", section: "projects" },
  { label: "Journey", href: "#journey", section: "journey" },
  { label: "Resume", href: "/resume/Mamun_Reja_Resume.pdf?v=8BE901BC", download: "Mamun_Reja_Resume.pdf" },
  { label: "Lab", href: "#lab", section: "lab" },
  { label: "Certificates", href: "#certificates", section: "certificates" },
  { label: "Contact", href: "#contact", section: "contact" },
] as const;

export function SiteNav() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const nodes = links.flatMap((link) => "section" in link ? [document.getElementById(link.section)] : [])
      .filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-28% 0px -62% 0px", threshold: [0, 0.15, 0.45] });
    nodes.forEach((node) => observer.observe(node));
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => { observer.disconnect(); window.removeEventListener("keydown", onKeyDown); };
  }, []);
  return (
    <header className="site-nav-wrap">
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="wordmark" href="#home" aria-label="Mamun Reja home">
          <ProfileImage variant="nav" decorative /><span className="wordmark-text">MR<span>.</span></span>
        </a>
        <div className={`nav-links ${open ? "is-open" : ""}`}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              download={"download" in link ? link.download : undefined}
              className={"section" in link && active === link.section ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav-end">
          <span className={`availability ${portfolio.availability ? "configured" : "unset"}`}>
            <i aria-hidden="true" />{portfolio.availability || "Status not set"}
          </span>
          <a className="nav-contact" href="#contact">Connect <ArrowUpRight size={14} /></a>
          <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
