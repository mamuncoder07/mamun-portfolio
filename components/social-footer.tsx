import { SocialMarquee } from "@/components/social-marquee";

export function SocialFooter() {
  return (
    <section className="social-footer-section" aria-labelledby="social-footer-title">
      <div className="page-width">
        <div className="social-footer-panel">
          <div className="social-footer-particles" aria-hidden="true">
            <span /><span /><span /><span /><span /><span /><span /><span />
          </div>
          <div className="social-footer-heading">
            <p className="social-footer-badge"><span />LET&apos;S CONNECT</p>
            <h2 id="social-footer-title">Find Me Across the Web</h2>
            <p className="social-footer-subtitle">Connect, follow, and explore my work across different platforms.</p>
            <p className="social-footer-context">Building, learning, and connecting with the tech community.</p>
          </div>
          <SocialMarquee />
          <p className="social-footer-signoff">Stay curious. Keep building. Keep growing.</p>
        </div>
      </div>
    </section>
  );
}
