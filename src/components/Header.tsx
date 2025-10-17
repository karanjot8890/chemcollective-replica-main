import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/store/useWorkspace";

export default function Header() {
  const { clearWorkspace, setZoom, zoom, tutorEnabled, setTutorEnabled } = useWorkspace();

  const handleSave = () => {
    // Zustand persist handles saving automatically
    alert("Experiment saved locally.");
  };
  const handleOpen = () => {
    alert("Your last saved experiment has been loaded from local storage.");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2">
        <div className="font-semibold mr-4">Chemistar E-Laboratory</div>
        <Button variant="secondary" onClick={clearWorkspace}>New</Button>
        <Button variant="secondary" onClick={handleOpen}>Open</Button>
        <Button onClick={handleSave}>Save</Button>
        <div className="ml-2 flex items-center gap-2">
          <Button variant="outline" onClick={() => setZoom(zoom + 0.1)}>Zoom In</Button>
          <Button variant="outline" onClick={() => setZoom(zoom - 0.1)}>Zoom Out</Button>
        </div>
        <div className="ml-auto" />
        <Button variant={tutorEnabled ? "default" : "outline"} onClick={() => setTutorEnabled(!tutorEnabled)}>
          AI Tutor {tutorEnabled ? "ON" : "OFF"}
        </Button>
      </div>
    </div>
  );
}


