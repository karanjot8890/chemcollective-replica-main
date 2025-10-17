export interface ParsedChemical {
  name: string; // e.g., "Copper(II) sulfate"
  formula?: string; // e.g., CuSO4
  state: "solid" | "liquid" | "gas" | "aqueous";
  form?: string; // powder, strip, wire
  concentrationM?: number; // molarity for aqueous
  volumeMl?: number;
  temperatureC?: number;
  colorHex?: string; // for visualization
}

export interface ReactionPrediction {
  effects: {
    color?: string;
    gas?: string;
    heat?: "endothermic" | "exothermic" | "neutral";
    precipitate?: string;
  };
  products?: string[];
  text: string;
}


