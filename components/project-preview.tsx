"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export function ProjectPreview({
  image,
  imageAlt,
  projectNumber,
  projectTitle,
}: {
  image: StaticImageData;
  imageAlt: string;
  projectNumber: string;
  projectTitle: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <>
      <button
        className="project-preview"
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Open full-size preview for ${projectTitle}`}
        aria-haspopup="dialog"
      >
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 760px) 90vw, (max-width: 1000px) 90vw, 36vw" className="project-preview-image" />
      </button>
      <dialog
        ref={dialogRef}
        className="project-lightbox"
        aria-labelledby={`project-lightbox-title-${projectNumber}`}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setIsOpen(false);
          }
        }}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
      >
        <div className="project-lightbox-content">
          <button
            ref={closeButtonRef}
            className="project-lightbox-close"
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close image preview"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <div className="project-lightbox-visual">
            <Image src={image} alt={imageAlt} fill sizes="92vw" className="project-lightbox-image" />
          </div>
          <h2 className="project-lightbox-title" id={`project-lightbox-title-${projectNumber}`}>{projectTitle}</h2>
        </div>
      </dialog>
    </>
  );
}
