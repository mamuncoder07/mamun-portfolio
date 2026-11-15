"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type MamunMascotState =
  | "idle"
  | "greeting"
  | "thinking"
  | "searching"
  | "happy"
  | "error"
  | "listening";
export type MamunRuntimeState =
  | "idle"
  | "waking"
  | "thinking"
  | "searching"
  | "happy"
  | "failed"
  | "listening";
export type MamunMascotGesture = "nod" | "bounce" | "spin";

type MascotProps = {
  state?: MamunMascotState;
  size?: number;
  paused?: boolean;
  gesture?: MamunMascotGesture;
  gestureSequence?: number;
  settleAfterMs?: number;
  className?: string;
};

const runtimeState: Record<MamunMascotState, MamunRuntimeState> = {
  idle: "idle",
  greeting: "waking",
  thinking: "thinking",
  searching: "searching",
  happy: "happy",
  error: "failed",
  listening: "listening",
};

const MascotRuntime = dynamic(
  () => import("@/components/mamun-mascot-runtime").then((module) => module.MamunMascotRuntime),
  {
    ssr: false,
    loading: () => <span className="mamun-mascot-placeholder" aria-hidden="true" />,
  },
);

export function MamunMascot({
  state = "idle",
  size = 128,
  paused = false,
  gesture,
  gestureSequence,
  settleAfterMs,
  className,
}: MascotProps) {
  return (
    <MascotRuntime
      state={runtimeState[state]}
      size={size}
      paused={paused}
      gesture={gesture}
      gestureSequence={gestureSequence}
      settleAfterMs={settleAfterMs}
      className={className}
    />
  );
}

type LauncherProps = {
  state?: MamunMascotState;
  onClick: () => void;
};

export function MamunMascotLauncher({ state = "idle", onClick }: LauncherProps) {
  return (
    <button
      className="assistant-launch"
      type="button"
      onClick={onClick}
      aria-label="Open Mamun AI portfolio guide"
      title="Open Mamun AI"
      aria-expanded={false}
    >
      <MamunMascot state={state} size={50} />
    </button>
  );
}

type StageProps = MascotProps;

export function MamunAvatarStage({
  state = "idle",
  size = 240,
  paused = false,
  gesture,
  gestureSequence,
}: StageProps) {
  return (
    <div className="mamun-avatar-stage">
      <MamunMascot
        state={state}
        size={size}
        paused={paused}
        gesture={gesture}
        gestureSequence={gestureSequence}
      />
    </div>
  );
}

type ControlState = Extract<MamunMascotState, "idle" | "thinking" | "happy" | "greeting">;

type ControlsProps = {
  state: ControlState;
  playing: boolean;
  onStateChange: (state: ControlState) => void;
  onGesture: (gesture: MamunMascotGesture) => void;
  onTogglePlaying: () => void;
  onReset: () => void;
};

export function MamunMascotControls({
  state,
  playing,
  onStateChange,
  onGesture,
  onTogglePlaying,
  onReset,
}: ControlsProps) {
  return (
    <div className="mamun-mascot-controls" aria-label="Mamun AI animation controls">
      <div className="mamun-control-group" aria-label="Playback and states">
        <button type="button" onClick={onTogglePlaying} aria-pressed={playing}>
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" className={state === "idle" ? "is-active" : ""} onClick={() => onStateChange("idle")}>Idle</button>
        <button type="button" className={state === "thinking" ? "is-active" : ""} onClick={() => onStateChange("thinking")}>Thinking</button>
        <button type="button" className={state === "happy" ? "is-active" : ""} onClick={() => onStateChange("happy")}>Happy</button>
        <button type="button" className={state === "greeting" ? "is-active" : ""} onClick={() => onStateChange("greeting")}>Greeting</button>
      </div>
      <div className="mamun-control-group" aria-label="Gestures and reset">
        <button type="button" onClick={() => onGesture("nod")}>Nod</button>
        <button type="button" onClick={() => onGesture("bounce")}>Bounce</button>
        <button type="button" onClick={() => onGesture("spin")}>Spin</button>
        <button type="button" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}

type AssistantEvent =
  | { type: "opened" }
  | { type: "input"; hasText: boolean }
  | { type: "request" }
  | { type: "searched" }
  | { type: "answered" }
  | { type: "failed" }
  | { type: "closed" };

type AdapterContextValue = {
  state: MamunMascotState;
  dispatch: (event: AssistantEvent) => void;
};

const AdapterContext = createContext<AdapterContextValue | null>(null);

export function MamunAIStateAdapter({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MamunMascotState>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dispatch = useCallback((event: AssistantEvent) => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = null;

    switch (event.type) {
      case "opened":
        setState("greeting");
        resetTimer.current = setTimeout(() => setState("idle"), 1200);
        break;
      case "input":
        setState(event.hasText ? "listening" : "idle");
        break;
      case "request":
        setState("thinking");
        break;
      case "searched":
        setState("searching");
        break;
      case "answered":
        setState("happy");
        resetTimer.current = setTimeout(() => setState("idle"), 1400);
        break;
      case "failed":
        setState("error");
        resetTimer.current = setTimeout(() => setState("idle"), 1800);
        break;
      case "closed":
        setState("idle");
        break;
    }
  }, []);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  return <AdapterContext.Provider value={{ state, dispatch }}>{children}</AdapterContext.Provider>;
}

export function useMamunAIState() {
  const context = useContext(AdapterContext);
  if (!context) throw new Error("useMamunAIState must be used inside MamunAIStateAdapter");
  return context;
}

