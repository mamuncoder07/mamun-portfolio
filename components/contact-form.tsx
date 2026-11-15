"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Mail, Send } from "lucide-react";
import { portfolio } from "@/config/portfolio";
import { BrandLogo } from "@/components/brand-logo";

type SubmitState = { kind: "idle" | "sending" | "success" | "error"; message: string };
export function ContactForm() {
  const [state, setState] = useState<SubmitState>({ kind: "idle", message: "" });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    setState({ kind: "sending", message: "Sending securely…" });
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        name: data.get("name"), email: data.get("email"), subject: data.get("subject"), message: data.get("message"), website: data.get("website"),
      }) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "The message could not be delivered.");
      setState({ kind: "success", message: result.message || "Your message was sent." });
      form.reset();
    } catch (error) {
      setState({ kind: "error", message: error instanceof Error ? error.message : "The message could not be delivered. Please try again later." });
    }
  }
  return (
    <section className="section section-contact" id="contact" aria-labelledby="contact-title">
      <div className="page-width contact-layout">
        <div className="contact-copy"><p className="eyebrow"><span className="eyebrow-index">08</span><span className="eyebrow-dot" />Open channel</p><h2 id="contact-title">Let&apos;s Build<br /><em>Something Together.</em></h2><p>Have an interesting idea, opportunity, or collaboration in mind? I&apos;d love to connect.</p>
          <div className="contact-links">
            <a href={portfolio.github} target="_blank" rel="noreferrer"><span className="contact-link-icon"><BrandLogo name="GitHub" className="brand-mark contact-brand-mark" /></span><span><small>GitHub</small><strong>@mamuncoder07</strong></span><ArrowUpRight size={15} /></a>
            {portfolio.linkedin ? <a href={portfolio.linkedin} target="_blank" rel="noreferrer"><span className="contact-link-icon"><BrandLogo name="LinkedIn" className="brand-mark contact-brand-mark" /></span><span><small>LinkedIn</small><strong>Professional profile</strong></span><ArrowUpRight size={15} /></a> : <div className="contact-link-muted"><span className="contact-link-icon"><BrandLogo name="LinkedIn" className="brand-mark contact-brand-mark" /></span><span><small>LinkedIn</small><strong>Link not configured</strong></span><span className="not-set">Not set</span></div>}
            {portfolio.email ? <a href={`mailto:${portfolio.email}`}><span className="contact-link-icon"><Mail size={17} /></span><span><small>Email</small><strong>{portfolio.email}</strong></span><ArrowUpRight size={15} /></a> : <div className="contact-link-muted"><span className="contact-link-icon"><Mail size={17} /></span><span><small>Email</small><strong>Address not configured</strong></span><span className="not-set">Not set</span></div>}
          </div>
        </div>
        <form className="contact-form" onSubmit={submit} noValidate>
          <div className="form-heading"><span className="micro-label">Send a message</span><span className="form-lock"><span /> Server-side validation</span></div>
          <div className="form-row"><label>Name<input name="name" type="text" autoComplete="name" minLength={2} maxLength={100} placeholder="Your name" required /></label><label>Email<input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required /></label></div>
          <label>Subject<input name="subject" type="text" maxLength={140} placeholder="What would you like to discuss?" required /></label>
          <label>Message<textarea name="message" rows={5} minLength={10} maxLength={4000} placeholder="A little context goes a long way…" required /></label>
          <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <div className="form-submit-row"><button type="submit" className="button button-primary" disabled={state.kind === "sending"}>{state.kind === "sending" ? "Sending…" : "Send message"}<Send size={15} /></button><p className={`form-status status-${state.kind}`} role="status" aria-live="polite">{state.message || "Delivery requires the owner’s email service configuration."}</p></div>
          <p className="form-privacy">Your message is sent only after a delivery service is configured. This form does not save messages on this site.</p>
        </form>
      </div>
    </section>
  );
}
