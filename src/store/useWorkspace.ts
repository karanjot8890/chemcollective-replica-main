import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { ApparatusItem, TransferAction, ReactionEffect } from "@/types/apparatus";
import type { ParsedChemical, ReactionPrediction } from "@/types/chemical";

export interface MeasurementLogEntry {
  id: string;
  apparatusId: string;
  type: "pH" | "Temperature" | "Conductivity";
  value: number;
  timestamp: number;
}

export interface WorkspaceState {
  apparatus: ApparatusItem[];
  transfers: TransferAction[];
  measurements: MeasurementLogEntry[];
  tutorEnabled: boolean;
  reactionHistory: Array<{
    id: string;
    a?: ParsedChemical;
    b?: ParsedChemical;
    effect: ReactionEffect;
    prediction?: ReactionPrediction;
    timestamp: number;
  }>;
  zoom: number;

  addApparatus: (partial: Partial<ApparatusItem> & { type: ApparatusItem["type"]; capacityMl?: number }) => void;
  updateApparatus: (id: string, updates: Partial<ApparatusItem>) => void;
  removeApparatus: (id: string) => void;
  addChemicalTo: (id: string, chemical: ParsedChemical) => void;
  transfer: (fromId: string, toId: string, volumeMl: number) => void;
  logMeasurement: (entry: Omit<MeasurementLogEntry, "id" | "timestamp">) => void;
  clearWorkspace: () => void;
  setZoom: (z: number) => void;
  setTutorEnabled: (on: boolean) => void;
  recordReaction: (data: WorkspaceState["reactionHistory"][number]) => void;
}

export const useWorkspace = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      apparatus: [],
      transfers: [],
      measurements: [],
      tutorEnabled: false,
      reactionHistory: [],
      zoom: 1,

      addApparatus: (partial) =>
        set((state) => ({
          apparatus: [
            ...state.apparatus,
            {
              id: uuidv4(),
              label: `${partial.type} ${String(partial.capacityMl ?? "").trim()} ${String.fromCharCode(64 + state.apparatus.length + 1)}`.trim(),
              x: 100 + state.apparatus.length * 80,
              y: 300,
              contents: undefined,
              ...partial,
            },
          ],
        })),

      updateApparatus: (id, updates) =>
        set((state) => ({
          apparatus: state.apparatus.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),

      removeApparatus: (id) =>
        set((state) => ({
          apparatus: state.apparatus.filter((a) => a.id !== id),
        })),

      addChemicalTo: (id, chemical) =>
        set((state) => ({
          apparatus: state.apparatus.map((a) =>
            a.id === id
              ? {
                  ...a,
                  contents: {
                    label: chemical.name,
                    colorHex: chemical.colorHex ?? "#4f46e5",
                    volumeMl: chemical.volumeMl,
                    state: chemical.state === "aqueous" ? "liquid" : (chemical.state as any),
                    description: `${chemical.formula ?? chemical.name}${chemical.concentrationM ? ` ${chemical.concentrationM}M` : ""}`,
                  },
                }
              : a
          ),
        })),

      transfer: (fromId, toId, volumeMl) =>
        set((state) => {
          const from = state.apparatus.find((a) => a.id === fromId);
          const to = state.apparatus.find((a) => a.id === toId);
          if (!from || !to || !from.contents) return {} as any;

          const actualVolume = Math.min(volumeMl, from.contents.volumeMl ?? 0);
          const remaining = Math.max(0, (from.contents.volumeMl ?? 0) - actualVolume);

          const mixedColor = to.contents?.colorHex
            ? blendColors(to.contents.colorHex, from.contents.colorHex ?? "#4f46e5")
            : from.contents.colorHex ?? "#4f46e5";

          return {
            apparatus: state.apparatus.map((a) => {
              if (a.id === fromId) {
                return { ...a, contents: { ...a.contents!, volumeMl: remaining } };
              }
              if (a.id === toId) {
                const newVol = (a.contents?.volumeMl ?? 0) + actualVolume;
                return {
                  ...a,
                  contents: {
                    label: a.contents?.label || from.contents.label,
                    colorHex: mixedColor,
                    volumeMl: newVol,
                    state: "liquid",
                    description: a.contents?.description || from.contents.description,
                  },
                };
              }
              return a;
            }),
            transfers: [
              ...state.transfers,
              { fromApparatusId: fromId, toApparatusId: toId, volumeMl: actualVolume, timestamp: Date.now() },
            ],
          };
        }),

      logMeasurement: (entry) =>
        set((state) => ({
          measurements: [
            ...state.measurements,
            { id: uuidv4(), timestamp: Date.now(), ...entry },
          ],
        })),

      clearWorkspace: () =>
        set(() => ({ apparatus: [], transfers: [], measurements: [], reactionHistory: [] })),

      setZoom: (z) => set(() => ({ zoom: Math.max(0.5, Math.min(2, z)) })),

      setTutorEnabled: (on) => set(() => ({ tutorEnabled: on })),

      recordReaction: (data) =>
        set((state) => ({ reactionHistory: [...state.reactionHistory, { ...data, id: uuidv4(), timestamp: Date.now() }] })),
    }),
    { name: "chemistar-workspace" }
  )
);

function blendColors(hex1?: string, hex2?: string) {
  const a = parseHex(hex1 ?? "#888888");
  const b = parseHex(hex2 ?? "#888888");
  const mixed = [Math.floor((a[0] + b[0]) / 2), Math.floor((a[1] + b[1]) / 2), Math.floor((a[2] + b[2]) / 2)];
  return `#${mixed.map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
}


