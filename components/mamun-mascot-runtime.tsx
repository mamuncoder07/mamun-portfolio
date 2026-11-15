"use client";

import { createAvatar, type AvatarHandle } from "@bible-strong/avatar-react";
import { useEffect, useRef } from "react";
import { mamunAvatarCharacter } from "@/config/mamun-avatar";
import type { MamunMascotGesture, MamunRuntimeState } from "@/components/mamun-mascot";

const Avatar = createAvatar(mamunAvatarCharacter);

type MamunMascotRuntimeProps = {
  state: MamunRuntimeState;
  size: number;
  paused: boolean;
  gesture?: MamunMascotGesture;
  gestureSequence?: number;
  settleAfterMs?: number;
  className?: string;
};

export function MamunMascotRuntime({
  state,
  size,
  paused,
  gesture,
  gestureSequence = 0,
  settleAfterMs,
  className,
}: MamunMascotRuntimeProps) {
  const avatarRef = useRef<AvatarHandle>(null);

  useEffect(() => {
    if (gesture) avatarRef.current?.poke(gesture);
  }, [gesture, gestureSequence]);

  return (
    <Avatar
      ref={avatarRef}
      state={state}
      size={size}
      paused={paused}
      settleAfterMs={settleAfterMs}
      className={className}
      ariaLabel="Mamun AI green mascot"
    />
  );
}
