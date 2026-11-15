"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownToLine, ArrowUpRight, Award, ExternalLink, X } from "lucide-react";
import { certificates, type Certificate } from "@/config/certificates";
import { SectionHeading } from "@/components/section-heading";

export function CertificatesSection() {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  function openCertificate(certificate: Certificate) {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelectedCertificate(certificate);
  }

  const closeCertificate = useCallback(() => {
    setSelectedCertificate(null);
  }, []);

  return (
    <>
      <section className="section section-certificates" id="certificates" aria-labelledby="section-title-07">
        <div className="page-width">
          <SectionHeading
            index="07"
            eyebrow="Learning in practice"
            title="Certificates & Achievements"
            body="Every certificate represents another step in my journey of learning, building, and growing in technology."
          />
          <div className="certificate-grid">
            {certificates.map((certificate, index) => (
              <CertificateCard
                certificate={certificate}
                index={index}
                key={certificate.fileName}
                onView={() => openCertificate(certificate)}
              />
            ))}
          </div>
        </div>
      </section>
      <CertificatePreviewModal certificate={selectedCertificate} onClose={closeCertificate} previousFocus={previousFocus} />
    </>
  );
}

function CertificateCard({
  certificate,
  index,
  onView,
}: {
  certificate: Certificate;
  index: number;
  onView: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  function tilt(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--certificate-tilt-x", `${-y * 3}deg`);
    event.currentTarget.style.setProperty("--certificate-tilt-y", `${x * 3.5}deg`);
  }

  function resetTilt(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--certificate-tilt-x", "0deg");
    event.currentTarget.style.setProperty("--certificate-tilt-y", "0deg");
  }

  return (
    <article
      className="certificate-card"
      onPointerMove={tilt}
      onPointerLeave={resetTilt}
      style={{ "--certificate-order": index } as CSSProperties}
    >
      <div className="certificate-preview">
        {!loaded ? <div className="certificate-preview-loading" aria-hidden="true"><span /><span /><span /></div> : null}
        <iframe
          title={`${certificate.title} first-page preview`}
          src={certificate.previewPath}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          onLoad={() => setLoaded(true)}
        />
        <button className="certificate-preview-trigger" type="button" onClick={onView} aria-label={`View ${certificate.title}`} />
        <span className="certificate-preview-badge"><Award size={14} /> Certificate {String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="certificate-card-content">
        <h3>{certificate.title}</h3>
        <div className="certificate-card-actions">
          <button type="button" className="certificate-button certificate-button-view" onClick={onView}>
            View Certificate <ArrowUpRight size={16} aria-hidden="true" />
          </button>
          <a className="certificate-button certificate-button-download" href={certificate.pdfPath} download={certificate.fileName} aria-label={`Download ${certificate.fileName}`}>
            <ArrowDownToLine size={17} aria-hidden="true" /><span>Download PDF</span>
          </a>
        </div>
      </div>
    </article>
  );
}

function CertificatePreviewModal({
  certificate,
  onClose,
  previousFocus,
}: {
  certificate: Certificate | null;
  onClose: () => void;
  previousFocus: RefObject<HTMLElement | null>;
}) {
  const reduceMotion = useReducedMotion();
  const closeButton = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!certificate) return;

    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const dialog = document.querySelector<HTMLElement>(".certificate-modal");
      const focusable = dialog?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = priorOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus.current?.focus();
    };
  }, [certificate, onClose, previousFocus]);

  useEffect(() => {
    setLoaded(false);
  }, [certificate]);

  return (
    <AnimatePresence>
      {certificate ? (
        <motion.div
          className="certificate-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <motion.div
            className="certificate-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-modal-title"
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
          >
            <div className="certificate-modal-header">
              <div>
                <span className="certificate-modal-eyebrow"><Award size={14} /> Certificate preview</span>
                <h2 id="certificate-modal-title">{certificate.title}</h2>
              </div>
              <button ref={closeButton} type="button" className="certificate-modal-close" onClick={onClose} aria-label="Close certificate preview">
                <X size={20} />
              </button>
            </div>
            <div className="certificate-modal-viewer">
              {!loaded ? <div className="certificate-modal-loading" role="status">Loading certificate preview…</div> : null}
              <iframe
                key={certificate.fileName}
                title={certificate.title}
                src={`${certificate.pdfPath}#toolbar=1&navpanes=0&view=FitH`}
                onLoad={() => setLoaded(true)}
              />
            </div>
            <div className="certificate-modal-footer">
              <a className="certificate-button certificate-button-download" href={certificate.pdfPath} download={certificate.fileName}>
                <ArrowDownToLine size={17} aria-hidden="true" /> Download PDF
              </a>
              <a className="certificate-modal-open" href={certificate.pdfPath} target="_blank" rel="noreferrer">
                Open full-size <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
