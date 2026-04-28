import { Song } from "@/app/types/modes";

export function shuffle(array: Song[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  return array;
}

export function getStaticOrbitStepSize(
  temperature: number,
  poolSize: number,
  playlistLength: number
): number {
  const t = Math.min(Math.max(temperature, 0), 1);
  const maxStep = Math.max(1, Math.floor(poolSize / playlistLength));
  const step = 1 + t * (maxStep - 1);

  return Math.max(1, Math.round(step));
}

export function getDriftingOrbitStepSize(
  temperature: number,
  poolSize: number
): number {
  const t = Math.min(Math.max(temperature, 0), 1);
  return Math.min(Math.max(1, Math.round(poolSize * t)), poolSize - 1);
}
