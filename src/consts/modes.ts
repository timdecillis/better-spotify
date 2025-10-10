import { Mode } from "@/app/types/modes";
import {
  driftingOrbit,
  staticOrbit,
  thermalAscent,
  thermalDrift,
  twinGravity,
} from "./mode-handlers";

export const playlistLength = 10;

export const modes: Mode[] = [
  {
    name: "Static Orbit",
    description: "Each track is based off the initial seed track.",
    range: false,
    handler: staticOrbit,
  },
  {
    name: "Drifting Orbit",
    description: "Each track is based off the previous track.",
    range: false,
    handler: driftingOrbit,
  },
  {
    name: "Thermal Ascent",
    description:
      "Each track is based off the initial seed track, but uses a shifting temperature range.",
    range: true,
    handler: thermalAscent,
  },
  {
    name: "Thermal Drift",
    description:
      "Each track is based off the previous track, but uses a shifting temperature range.",
    range: true,
    handler: thermalDrift,
  },

  {
    name: "Twin Gravity",
    description:
      "The playlist uses a starting track and an ending track, with the tracks in between serving as a bridge between the two.",
    range: false,
    handler: twinGravity,
  },
];
