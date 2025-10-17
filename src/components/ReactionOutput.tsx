import { useWorkspace } from "@/store/useWorkspace";

export default function ReactionOutput() {
  const { reactionHistory } = useWorkspace();
  return (
    <div className="p-3 border-t h-40 overflow-auto text-sm">
      {reactionHistory.length === 0 ? (
        <div className="text-muted-foreground">No reactions yet. Mix chemicals to see predictions.</div>
      ) : (
        <ul className="space-y-2">
          {reactionHistory.slice(-10).map((r) => (
            <li key={r.id} className="border rounded p-2">
              <div className="font-medium">{r.effect.description}</div>
              {r.prediction?.text && <div className="text-muted-foreground">{r.prediction.text}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


