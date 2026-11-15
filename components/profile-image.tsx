import Image from "next/image";

type ProfileImageVariant = "hero" | "about" | "nav" | "assistant";

type ProfileImageProps = {
  variant: ProfileImageVariant;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
};

const portraitAlt = "Mamun Reja — AI/ML Engineer and Data Scientist";
const portraitSizes: Record<ProfileImageVariant, string> = {
  hero: "(max-width: 760px) 72vw, (max-width: 1000px) 30vw, 340px",
  about: "(max-width: 420px) 100vw, (max-width: 760px) 48vw, (max-width: 1000px) 50vw, 340px",
  nav: "30px",
  assistant: "28px",
};

export function ProfileImage({ variant, className = "", priority = false, decorative = false }: ProfileImageProps) {
  return (
    <span
      className={`profile-image-frame profile-image-${variant} ${className}`.trim()}
      aria-hidden={decorative ? true : undefined}
    >
      <span className="profile-image-window">
        <Image
          src="/images/mamun-reja.webp"
          alt={decorative ? "" : portraitAlt}
          fill
          sizes={portraitSizes[variant]}
          priority={priority}
          unoptimized
          draggable={false}
          className="profile-image-media"
        />
      </span>
    </span>
  );
}
