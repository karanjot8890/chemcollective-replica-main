import type { ParsedChemical, ReactionPrediction } from "@/types/chemical";

const API_KEY = (import.meta as any).env?.VITE_OPENAI_API_KEY || (import.meta as any).env?.OPENAI_API_KEY;

async function callOpenAI(prompt: string): Promise<string | null> {
  if (!API_KEY) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content as string | undefined;
    return content ?? null;
  } catch {
    return null;
  }
}

export async function parseChemicalNLP(input: string): Promise<ParsedChemical> {
  const prompt = `You are a chemical parser. Extract: name, formula(if easy), state(solid|liquid|gas|aqueous), form(optional), concentrationM(number), volumeMl(number), temperatureC(number), colorHex(approx). Input: ${input}. Reply JSON.`;
  const ai = await callOpenAI(prompt);
  if (ai) {
    try {
      const parsed = JSON.parse(ai);
      return normalizeChemical(parsed);
    } catch {
      // fall through to heuristic
    }
  }
  return heuristicParse(input);
}

export async function predictReactionNLP(a: ParsedChemical, b?: ParsedChemical): Promise<ReactionPrediction> {
  const template = `You are a chemical reaction simulator. Given these inputs:\nChemical A: ${fmt(a)}\nChemical B: ${b ? fmt(b) : "(none)"}\nPredict what happens when mixed. Include color, temperature change, gas, precipitate, and text description. Reply JSON with {effects:{color,gas,heat,precipitate}, products:[...], text}.`;
  const ai = await callOpenAI(template);
  if (ai) {
    try {
      const parsed = JSON.parse(ai);
      return parsed as ReactionPrediction;
    } catch {
      // ignore
    }
  }
  // simple mock
  const color = a.colorHex || b?.colorHex || "#60a5fa";
  return {
    effects: { color, gas: Math.random() > 0.7 ? "bubbles" : undefined, heat: Math.random() > 0.5 ? "exothermic" : "neutral" },
    products: b ? [`${a.formula ?? a.name} + ${b.formula ?? b.name}`] : undefined,
    text: "Mock prediction: subtle color change observed; minimal heat.",
  };
}

function normalizeChemical(obj: any): ParsedChemical {
  return {
    name: obj.name || "Unknown",
    formula: obj.formula,
    state: obj.state ?? "aqueous",
    form: obj.form,
    concentrationM: num(obj.concentrationM),
    volumeMl: num(obj.volumeMl),
    temperatureC: num(obj.temperatureC),
    colorHex: obj.colorHex || guessColor(obj.name),
  };
}

function heuristicParse(input: string): ParsedChemical {
  const lower = input.toLowerCase();
  const vol = /([0-9]+)\s*ml/.exec(lower)?.[1];
  const conc = /([0-9]+\.?[0-9]*)\s*m/.exec(lower)?.[1];
  const temp = /([0-9]+)\s*°?c/.exec(lower)?.[1];
  const aqueous = /(aq|aqueous)/.test(lower);
  const name = input.replace(/\d+\s*ml|\d+\s*m|\d+\s*°?c|aqueous|aq/gi, "").trim();
  return {
    name: name || "Unknown",
    state: aqueous ? "aqueous" : (/(solid|s)/.test(lower) ? "solid" : /(gas|g)/.test(lower) ? "gas" : "liquid"),
    concentrationM: conc ? Number(conc) : undefined,
    volumeMl: vol ? Number(vol) : undefined,
    temperatureC: temp ? Number(temp) : undefined,
    colorHex: guessColor(name),
  };
}

function guessColor(name?: string): string | undefined {
  if (!name) return undefined;
  const n = name.toLowerCase();
  if (n.includes("copper")) return "#2563eb"; // blue
  if (n.includes("iron")) return "#b45309"; // brownish
  if (n.includes("permanganate")) return "#7c3aed"; // purple
  if (n.includes("chromate")) return "#fbbf24"; // yellow
  return undefined;
}

function fmt(c: ParsedChemical) {
  return `${c.name}${c.formula ? ` (${c.formula})` : ""}, ${c.state}${c.concentrationM ? `, ${c.concentrationM}M` : ""}${c.volumeMl ? `, ${c.volumeMl}ml` : ""}${c.temperatureC ? `, ${c.temperatureC}°C` : ""}`;
}

function num(v: any): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}


