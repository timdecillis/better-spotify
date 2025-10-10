export type Song = {
  song: string;
  artist: string;
};

export type Name =
  | "Static Orbit"
  | "Drifting Orbit"
  | "Thermal Ascent"
  | "Thermal Drift"
  | "Twin Gravity";
export type Mode = {
  name: Name;
  description: string;
  range: boolean;
  handler: (artist: string, song: string) => Promise<Song[]>;
};
