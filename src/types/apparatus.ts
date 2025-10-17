export type ApparatusType =
  | "Beaker"
  | "Conical Flask"
  | "Test Tube"
  | "Boiling Tube"
  | "Pipette"
  | "Volumetric Flask"
  | "Measuring Cylinder"
  | "Burette"
  | "Watch Glass"
  | "Crucible"
  | "Funnel"
  | "Condenser"
  | "Stirring Rod"
  | "Tripod Stand"
  | "Wire Gauze"
  | "Clamp Stand"
  | "Bunsen Burner"
  | "White Tile"
  | "Centrifuge"
  | "Evaporating Dish";

export interface ApparatusContents {
  label: string;
  colorHex?: string;
  volumeMl?: number;
  massG?: number;
  state: "solid" | "liquid" | "gas";
  description?: string;
}

export interface ApparatusItem {
  id: string;
  type: ApparatusType;
  capacityMl?: number;
  label: string; // e.g., "Beaker A"
  x: number; // horizontal position on bench
  y: number; // fixed baseline but allow slight vertical for UI
  contents?: ApparatusContents;
}

export interface TransferAction {
  fromApparatusId: string;
  toApparatusId: string;
  volumeMl: number;
  timestamp: number;
}

export interface ReactionEffect {
  colorChange?: string;
  gas?: string;
  heat?: "endothermic" | "exothermic" | "neutral";
  precipitate?: string;
  description: string;
}


