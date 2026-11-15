"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { portfolio, projects, skillGroups, milestones } from "@/config/portfolio";
import {
  MamunAIStateAdapter,
  MamunMascot,
  MamunMascotLauncher,
  useMamunAIState,
} from "@/components/mamun-mascot";

type Message = { from: "user" | "assistant"; text: string };
const welcome = "Hi, I’m Mamun AI—a built-in guide to this portfolio. I answer from the information on this page; I’m not connected to a live AI service.";
function answer(question: string) {
  const q = question.toLowerCase();
  if (/who|about|mamun|background/.test(q)) return `${portfolio.name} is an aspiring AI/ML Engineer and Data Science enthusiast. He enjoys exploring machine learning, developing predictive models, solving problems and continuing to learn.`;
  if (/skill|technology|stack|tool/.test(q)) return `Listed areas include ${skillGroups.map((group) => `${group.name}: ${group.skills.join(", ")}`).join("; ")}. These are learning and interest areas, not proficiency scores.`;
  if (/project|built|work|movie|recommend|unemployment|car|iris/.test(q)) return `Featured work: ${projects.map((project) => project.title).join("; ")}. The Car Price Prediction model's verified R² score is 95.94%.`;
  if (/github|repo|source|open source/.test(q)) return `GitHub: ${portfolio.github}. The portfolio fetches public profile information when the GitHub API is available.`;
  if (/leetcode|problem/.test(q)) return portfolio.leetcode ? `LeetCode username: ${portfolio.leetcode}.` : "A LeetCode username has not been provided, so no statistics are shown.";
  if (/journey|learn|learning|study/.test(q)) return `The learning journey includes ${milestones.join("; ")}. No dates or completion percentages are claimed.`;
  if (/contact|email|linkedin|connect/.test(q)) return `Contact Mamun: GitHub ${portfolio.github}; ${portfolio.email ? `email ${portfolio.email}` : "email not configured"}; ${portfolio.linkedin ? `LinkedIn ${portfolio.linkedin}` : "LinkedIn not configured"}. Contact-form email delivery still requires provider configuration.`;
  return "I can share what this portfolio says about Mamun’s background, skills, projects, learning journey, GitHub and contact details. Try asking about one of those topics.";
}

export function Assistant() {
  return (
    <MamunAIStateAdapter>
      <AssistantExperience />
    </MamunAIStateAdapter>
  );
}

function AssistantExperience() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [processing, setProcessing] = useState(false);
  const pendingFrame = useRef<number | null>(null);
  const { state, dispatch } = useMamunAIState();

  useEffect(
    () => () => {
      if (pendingFrame.current !== null) cancelAnimationFrame(pendingFrame.current);
    },
    [],
  );

  function toggleAssistant() {
    const nextOpen = !open;
    setOpen(nextOpen);
    dispatch({ type: nextOpen ? "opened" : "closed" });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = draft.trim();
    if (!question || processing) return;
    setMessages((current) => [...current, { from: "user", text: question }]);
    setDraft("");
    setProcessing(true);
    dispatch({ type: "request" });

    pendingFrame.current = requestAnimationFrame(() => {
      pendingFrame.current = null;
      try {
        const response = answer(question);
        setMessages((current) => [...current, { from: "assistant", text: response }]);
        dispatch({ type: "answered" });
      } catch (error) {
        console.error("Mamun AI could not answer the portfolio question.", error);
        setMessages((current) => [
          ...current,
          { from: "assistant", text: "I couldn’t prepare an answer just now. Please try again." },
        ]);
        dispatch({ type: "failed" });
      } finally {
        setProcessing(false);
      }
    });
  }

  return (
    <div className="assistant-root">
      {open ? <section className="assistant-panel" aria-label="Mamun AI portfolio assistant">
        <header className="assistant-header"><MamunMascot state={state} size={48} /><span><strong>Mamun AI</strong><small>{state === "thinking" ? "Thinking…" : state === "listening" ? "Listening" : state === "searching" ? "Searching" : state === "error" ? "Something went wrong" : "Portfolio guide"}</small></span><button type="button" onClick={toggleAssistant} aria-label="Close assistant"><X size={19} /></button></header>
        <div className="assistant-messages" aria-live="polite"><div className="assistant-message assistant-response"><span className="assistant-message-mark"><MamunMascot size={22} settleAfterMs={1500} /></span>{welcome}</div>{messages.map((message, index) => <div className={`assistant-message ${message.from === "user" ? "assistant-user" : "assistant-response"}`} key={`${message.from}-${index}`}>{message.from === "assistant" ? <span className="assistant-message-mark"><MamunMascot size={22} settleAfterMs={1500} /></span> : null}{message.text}</div>)}</div>
        {processing ? <p className="assistant-processing" role="status">Finding a portfolio answer…</p> : null}
        <form className="assistant-form" onSubmit={submit}><label className="sr-only" htmlFor="assistant-question">Ask about this portfolio</label><input id="assistant-question" value={draft} onChange={(event) => { setDraft(event.target.value); dispatch({ type: "input", hasText: Boolean(event.target.value.trim()) }); }} placeholder="Ask about projects, skills…" disabled={processing}/><button type="submit" aria-label="Send question" disabled={processing || !draft.trim()}><Send size={15} /></button></form>
        <p className="assistant-disclaimer">Answers are based on portfolio content, not a live AI model.</p>
      </section> : null}
      {!open ? <MamunMascotLauncher onClick={toggleAssistant} /> : null}
    </div>
  );
}
