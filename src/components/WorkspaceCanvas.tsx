import { Stage, Layer, Rect, Group, Text } from "react-konva";
import { useWorkspace } from "@/store/useWorkspace";
import { useMemo, useRef, useState } from "react";
import { predictReactionNLP } from "@/lib/openai";

export default function WorkspaceCanvas() {
  const { apparatus, updateApparatus, transfer, zoom, recordReaction } = useWorkspace();
  const [dragId, setDragId] = useState<string | null>(null);
  const stageRef = useRef<any>(null);
  const width = useMemo(() => 1200, []);
  const height = useMemo(() => 600, []);

  const onDropCombine = async (aId: string, bId: string) => {
    if (aId === bId) return;
    // simple fixed transfer for demo
    transfer(aId, bId, 10);
    const a = apparatus.find((x) => x.id === aId)?.contents;
    const b = apparatus.find((x) => x.id === bId)?.contents;
    if (a) {
      const prediction = await predictReactionNLP(
        {
          name: a.label,
          state: a.state as any,
          volumeMl: a.volumeMl,
          colorHex: a.colorHex,
        },
        b
          ? { name: b.label, state: b.state as any, volumeMl: b.volumeMl, colorHex: b.colorHex }
          : undefined
      );
      recordReaction({
        effect: { description: prediction.text, colorChange: prediction.effects.color, gas: prediction.effects.gas, heat: prediction.effects.heat, precipitate: prediction.effects.precipitate },
      } as any);
    }
  };

  return (
    <div className="w-full h-full">
      <Stage width={width} height={height} scaleX={zoom} scaleY={zoom} ref={stageRef} className="bg-slate-50">
        <Layer>
          <Rect x={0} y={500} width={width} height={100} fill="#e5e7eb" />
          {apparatus.map((a) => (
            <Group
              key={a.id}
              x={a.x}
              y={a.y}
              draggable
              dragBoundFunc={(pos) => ({ x: Math.max(20, Math.min(width - 120, pos.x)), y: a.y })}
              onDragStart={() => setDragId(a.id)}
              onDragEnd={(e) => {
                const nx = e.target.x();
                updateApparatus(a.id, { x: nx });
                setDragId(null);
                // simple proximity pour: if close to another, transfer
                const near = apparatus.find((b) => b.id !== a.id && Math.abs((b.x ?? 0) - nx) < 40);
                if (near) onDropCombine(a.id, near.id);
              }}
            >
              <Rect width={100} height={120} fill="#fff" stroke="#0f172a" cornerRadius={8} shadowBlur={dragId === a.id ? 8 : 2} />
              <Text text={a.label} x={6} y={-18} fontSize={12} fill="#0f172a" />
              {a.contents && (
                <Rect
                  x={8}
                  y={80}
                  width={84}
                  height={Math.min(70, Math.max(6, (a.contents.volumeMl ?? 0) / ((a.capacityMl ?? 100) / 60)))}
                  fill={a.contents.colorHex ?? "#60a5fa"}
                  cornerRadius={4}
                />
              )}
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  );
}


