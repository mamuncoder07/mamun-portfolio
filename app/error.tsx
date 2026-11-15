"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { /* The UI intentionally avoids exposing internal error details. */ }, []);
  return <section className="not-found page-width"><span className="eyebrow"><span className="eyebrow-dot" />SYSTEM STATUS / RECOVERABLE</span><h1>That signal<br /><em>didn't resolve.</em></h1><p>Something interrupted this view. Your place in the portfolio is safe—try loading this section again.</p><button className="button button-primary" type="button" onClick={reset}>Retry this view <RefreshCw size={15} /></button></section>;
}
