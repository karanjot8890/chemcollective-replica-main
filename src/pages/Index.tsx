import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import WorkspaceCanvas from "@/components/WorkspaceCanvas";
import ReactionOutput from "@/components/ReactionOutput";
import MeasurementPanel from "@/components/MeasurementPanel";
import CalculatorPanel from "@/components/CalculatorPanel";

const Index = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header />
      <div className="pt-14 grid grid-cols-12 gap-0 flex-1 overflow-hidden">
        <aside className="col-span-4 md:col-span-3 border-r h-[calc(100vh-56px)] overflow-auto">
          <Sidebar />
        </aside>
        <main className="col-span-8 md:col-span-9 h-[calc(100vh-56px)] flex flex-col">
          <div className="flex-1">
            <WorkspaceCanvas />
          </div>
          <ReactionOutput />
          <MeasurementPanel />
          <CalculatorPanel />
        </main>
      </div>
    </div>
  );
};

export default Index;
