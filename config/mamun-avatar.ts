import { readCharacter } from "@bible-strong/avatar-core";

const mascotDefinition = {
  name: "Mamun AI",
  body: {
    primary: {
      type: "sphere",
      width: 240,
      height: 240,
      depth: 240,
      roundness: 1,
    },
    nodes: [],
  },
  colors: {
    body: "#39e75f",
    eyes: "#111316",
  },
  face: {
    eyes: {
      width: 0.78,
      height: 1.14,
      gap: 0.82,
      shiftY: 0.04,
    },
    perspective: 0.72,
  },
} as const;

const parsedMascot = readCharacter(mascotDefinition);

if (!parsedMascot.ok) {
  throw new Error(
    `Invalid Mamun AI avatar: ${parsedMascot.errors.map((error) => `${error.path}: ${error.message}`).join("; ")}`,
  );
}

export const mamunAvatarCharacter = parsedMascot.value;
