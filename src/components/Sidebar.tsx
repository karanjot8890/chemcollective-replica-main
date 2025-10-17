import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspace } from "@/store/useWorkspace";
import { parseChemicalNLP, predictReactionNLP } from "@/lib/openai";
import { useState } from "react";

export default function Sidebar() {
  const { apparatus, addApparatus, addChemicalTo, logMeasurement } = useWorkspace();
  const [nlpInput, setNlpInput] = useState("");
  const [target, setTarget] = useState<string | undefined>(undefined);

  const handleParseAdd = async () => {
    if (!target) return alert("Select an apparatus in 'Add To'.");
    const parsed = await parseChemicalNLP(nlpInput);
    addChemicalTo(target, parsed);
  };

  return (
    <div className="w-full h-full p-3">
      <div className="space-y-2">
        <Input placeholder="Enter chemical details (e.g., NaOH, 2M, aq, 30°C)" value={nlpInput} onChange={(e) => setNlpInput(e.target.value)} />
        <div className="flex items-center gap-2">
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Add To..." /></SelectTrigger>
            <SelectContent>
              {apparatus.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.label}{a.contents ? `, ${a.contents.label}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleParseAdd}>Add</Button>
        </div>
      </div>

      <Tabs defaultValue="apparatus" className="mt-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="apparatus">Apparatus</TabsTrigger>
          <TabsTrigger value="measure">Measurements</TabsTrigger>
          <TabsTrigger value="calc">Calculator/Graph</TabsTrigger>
        </TabsList>

        <TabsContent value="apparatus">
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { type: "Beaker", sizes: [50, 100, 250, 500] },
              { type: "Conical Flask", sizes: [50, 100, 250, 500] },
              { type: "Test Tube", sizes: [10] },
              { type: "Boiling Tube", sizes: [20] },
              { type: "Volumetric Flask", sizes: [50, 100, 250, 500] },
              { type: "Measuring Cylinder", sizes: [10, 25, 50, 100] },
              { type: "Burette", sizes: [100] },
              { type: "Pipette", sizes: [1, 2, 5, 10, 20, 25, 50, 100] },
              { type: "Watch Glass", sizes: [0] },
              { type: "Crucible", sizes: [0] },
              { type: "Funnel", sizes: [0] },
              { type: "Stirring Rod", sizes: [0] },
            ].map((ap) => (
              <div key={ap.type} className="border rounded p-2">
                <div className="text-sm font-medium">{ap.type}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ap.sizes.map((s) => (
                    <Button key={s} variant="outline" size="sm" onClick={() => addApparatus({ type: ap.type as any, capacityMl: s || undefined })}>
                      {s ? `${s} ml` : "Add"}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="measure">
          <div className="space-y-2 mt-2">
            <div className="text-sm text-muted-foreground">Tap an apparatus on the canvas to log a reading.</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => logMeasurement({ apparatusId: "-", type: "Temperature", value: 24 })}>Quick Temp</Button>
              <Button variant="outline" onClick={() => logMeasurement({ apparatusId: "-", type: "pH", value: 7 })}>Quick pH</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calc">
          <div className="text-sm mt-2">Use the Graph tab on the right to plot logged data.</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


