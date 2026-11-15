import { Hero } from "@/components/hero";
import { AboutSection, SkillsSection, ProjectsSection, OpenSourceSection, LeetCodeSection, JourneySection } from "@/components/portfolio-sections";
import { SectionHeading } from "@/components/section-heading";
import { TerminalSection } from "@/components/terminal";
import { ContactForm } from "@/components/contact-form";
import { CertificatesSection } from "@/components/certificates";
import { MamunMascotLab } from "@/components/mamun-mascot-lab";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <OpenSourceSection />
      <LeetCodeSection />
      <JourneySection />
      <CertificatesSection />
      <section className="section section-lab" id="lab" aria-labelledby="section-title-08">
        <div className="page-width">
          <SectionHeading index="08" eyebrow="Interactive portfolio" title="A little command line." body="Meet the Mamun AI mascot, then explore the portfolio with a handful of built-in commands. Nothing is executed outside this page." />
          <MamunMascotLab />
          <TerminalSection />
        </div>
      </section>
      <ContactForm />
    </>
  );
}
