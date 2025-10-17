import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useWorkspace } from "@/store/useWorkspace";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function CalculatorPanel() {
  const { measurements } = useWorkspace();

  const data = {
    labels: measurements.map((m) => new Date(m.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperature",
        data: measurements.filter((m) => m.type === "Temperature").map((m) => m.value),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.2)",
      },
      {
        label: "pH",
        data: measurements.filter((m) => m.type === "pH").map((m) => m.value),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
      },
    ],
  };

  return (
    <div className="p-3 h-64">
      <Line data={data} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
    </div>
  );
}


