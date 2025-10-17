import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { label: "File", items: ["New", "Open", "Save", "Export"] },
  { label: "Edit", items: ["Undo", "Redo", "Cut", "Copy", "Paste"] },
  { label: "View", items: ["Zoom In", "Zoom Out", "Reset Zoom", "Fullscreen"] },
  { label: "Help", items: ["Documentation", "Tutorials", "About"] },
];

export const LabHeader = () => {
  return (
    <header className="bg-lab-header text-lab-header-foreground h-14 flex items-center px-4 gap-6 border-b border-border">
      <div className="flex items-center gap-2">
        <div className="text-lg font-semibold">Virtual Lab</div>
      </div>
      
      <nav className="flex gap-1">
        {menuItems.map((menu) => (
          <DropdownMenu key={menu.label}>
            <DropdownMenuTrigger className="px-3 py-1.5 text-sm hover:bg-white/10 rounded flex items-center gap-1 transition-colors">
              {menu.label}
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {menu.items.map((item) => (
                <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </nav>
      
      <div className="ml-auto flex items-center gap-2">
        <button className="px-3 py-1 text-sm hover:bg-white/10 rounded transition-colors">
          🌐 EN
        </button>
      </div>
    </header>
  );
};
