"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, Terminal as TerminalIcon } from "lucide-react";
import { portfolio, projects, skillGroups } from "@/config/portfolio";

type Line = { command: string; response: string[] };
const commands = ["help", "whoami", "about", "skills", "projects", "github", "leetcode", "contact", "clear"];

function runCommand(command: string): string[] {
  switch (command.trim().toLowerCase()) {
    case "help": return ["Available portfolio commands:", "help · whoami · about · skills · projects · github · leetcode · contact · clear", "This is a portfolio interface; it does not run system commands."];
    case "whoami": return [portfolio.name, "AI/ML Engineer Aspirant", "Data Science Enthusiast", "Python Developer · Problem Solver"];
    case "about": return ["Exploring AI, machine learning and data science through practical projects.", portfolio.philosophy];
    case "skills": return [skillGroups.flatMap((group) => group.skills).join(" · "), "Areas of study, not proficiency rankings."];
    case "projects": return ["Featured projects:", ...projects.map((project) => `${project.number} / ${project.title}`)];
    case "github": return [`Public profile: ${portfolio.github}`, "GitHub data is pulled from its public API when available."];
    case "leetcode": return [portfolio.leetcode ? `Configured username: ${portfolio.leetcode}` : "LeetCode username not configured yet.", "No statistics are shown until a reliable account source is configured."];
    case "contact": return ["Let's build something intelligent together.", `GitHub: ${portfolio.github}`, portfolio.email ? `Email: ${portfolio.email}` : "Email is not configured.", portfolio.linkedin ? `LinkedIn: ${portfolio.linkedin}` : "LinkedIn is not configured.", "Contact-form email delivery requires provider configuration."];
    default: return ["Command not found. Try `help` to see the available portfolio commands."];
  }
}

export function TerminalSection() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Line[]>([]);
  const [sequence, setSequence] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [history]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    if (value.toLowerCase() === "clear") { setHistory([]); setInput(""); return; }
    setHistory((current) => [...current.slice(-12), { command: value, response: runCommand(value) }]);
    setSequence((current) => current + 1);
    setInput("");
  }
  return (
    <div className="terminal-window">
      <div className="terminal-titlebar"><div className="terminal-lights"><i /><i /><i /></div><span><TerminalIcon size={13} /> mamun://portfolio-shell</span><span className="terminal-version">Read-only</span></div>
      <div className="terminal-screen" role="log" aria-live="polite">
        <div className="terminal-welcome"><p className="terminal-prompt">mamun@portfolio <span>~</span> $ <span className="terminal-cmd">help</span></p><p>Welcome to Mamun&apos;s portfolio terminal.</p><p>Explore the portfolio with safe, built-in commands.</p><p className="terminal-muted">No operating-system commands are executed here.</p></div>
        {history.map((item, index) => <div className="terminal-output" key={`${sequence}-${index}`}><p className="terminal-prompt">mamun@portfolio <span>~</span> $ <span className="terminal-cmd">{item.command}</span></p>{item.response.map((line, lineIndex) => <p key={`${line}-${lineIndex}`} className="terminal-result">{line}</p>)}</div>)}
        <div ref={bottomRef} />
      </div>
      <form className="terminal-form" onSubmit={submit}><label className="terminal-prompt" htmlFor="terminal-input">mamun@portfolio <span>~</span> $</label><input id="terminal-input" autoComplete="off" spellCheck={false} value={input} onChange={(event) => setInput(event.target.value)} aria-label="Enter a portfolio command" placeholder="type a command…"/><button type="submit" aria-label="Run portfolio command"><ArrowRight size={17} /></button><span className="terminal-cursor" aria-hidden="true" /></form>
      <div className="terminal-shortcuts" aria-label="Quick commands">{commands.slice(0, 5).map((command) => <button type="button" key={command} onClick={() => { if (command === "clear") { setHistory([]); return; } setHistory((current) => [...current.slice(-12), { command, response: runCommand(command) }]); setSequence((current) => current + 1); }}>{command}</button>)}</div>
    </div>
  );
}
