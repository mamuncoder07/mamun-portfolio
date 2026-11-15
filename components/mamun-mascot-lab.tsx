"use client";

import { useState } from "react";
import {
  MamunAvatarStage,
  MamunMascotControls,
  type MamunMascotGesture,
  type MamunMascotState,
} from "@/components/mamun-mascot";

type LabState = Extract<MamunMascotState, "idle" | "thinking" | "happy" | "greeting">;

export function MamunMascotLab() {
  const [state, setState] = useState<LabState>("idle");
  const [playing, setPlaying] = useState(true);
  const [gesture, setGesture] = useState<MamunMascotGesture>();
  const [gestureSequence, setGestureSequence] = useState(0);

  function playGesture(nextGesture: MamunMascotGesture) {
    setGesture(nextGesture);
    setGestureSequence((current) => current + 1);
  }

  function reset() {
    setState("idle");
    setPlaying(true);
    setGesture(undefined);
    setGestureSequence((current) => current + 1);
  }

  return (
    <div className="mamun-lab-card">
      <div className="mamun-lab-stage">
        <span className="mamun-lab-orbit mamun-lab-orbit-one" aria-hidden="true" />
        <span className="mamun-lab-orbit mamun-lab-orbit-two" aria-hidden="true" />
        <MamunAvatarStage
          state={state}
          size={240}
          paused={!playing}
          gesture={gesture}
          gestureSequence={gestureSequence}
        />
        <p className="mamun-lab-caption">Your curious green companion</p>
      </div>
      <div className="mamun-lab-panel">
        <p className="micro-label">Animation studio</p>
        <h3>Meet Mamun AI.</h3>
        <p className="mamun-lab-description">
          Try the runtime&apos;s built-in states and gestures. Reduced-motion preferences are
          respected automatically.
        </p>
        <MamunMascotControls
          state={state}
          playing={playing}
          onStateChange={setState}
          onGesture={playGesture}
          onTogglePlaying={() => setPlaying((current) => !current)}
          onReset={reset}
        />
        <p className="mamun-lab-state" aria-live="polite">
          Playing <strong>{state === "greeting" ? "greeting (waking)" : state}</strong>
          {!playing ? " · paused" : ""}
        </p>
      </div>
    </div>
  );
}
