import { useWorkspace } from "@/store/useWorkspace";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

export default function MeasurementPanel() {
  const { measurements } = useWorkspace();

  const exportXlsx = () => {
    const ws = XLSX.utils.json_to_sheet(measurements);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Measurements");
    XLSX.writeFile(wb, "chemistar_measurements.xlsx");
  };

  return (
    <div className="p-3 border-t h-48 overflow-auto text-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">Measurements</div>
        <Button size="sm" variant="outline" onClick={exportXlsx}>Export .xlsx</Button>
      </div>
      {measurements.length === 0 ? (
        <div className="text-muted-foreground">No logs yet. Take readings from the Measurements tab.</div>
      ) : (
        <ul className="space-y-1">
          {measurements.slice(-20).map((m) => (
            <li key={m.id}>
              {new Date(m.timestamp).toLocaleTimeString()} — {m.type}: {m.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


