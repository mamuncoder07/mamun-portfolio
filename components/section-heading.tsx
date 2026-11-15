type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
  body?: string;
  className?: string;
};

export function SectionHeading({ index, eyebrow, title, body, className = "" }: SectionHeadingProps) {
  return (
    <div className={`section-heading ${className}`}>
      <p className="eyebrow"><span className="eyebrow-index">{index}</span><span className="eyebrow-dot" />{eyebrow}</p>
      <h2 id={`section-title-${index}`}>{title}</h2>
      {body ? <p className="section-lede">{body}</p> : null}
    </div>
  );
}
