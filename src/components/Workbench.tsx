import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface WorkbenchItem {
  id: string;
  name: string;
  icon: any;
  x: number;
  y: number;
}

interface WorkbenchProps {
  draggedItem: any;
  onDrop: () => void;
}

export const Workbench = ({ draggedItem, onDrop }: WorkbenchProps) => {
  const [items, setItems] = useState<WorkbenchItem[]>([]);
  const [draggedWorkbenchItem, setDraggedWorkbenchItem] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (draggedItem) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      // Fixed Y position to place items on the tabletop (80px from bottom)
      const y = rect.height - 160;
      
      const newItem: WorkbenchItem = {
        ...draggedItem,
        id: `${draggedItem.id}-${Date.now()}`,
        x,
        y,
      };
      
      setItems([...items, newItem]);
      toast.success(`${draggedItem.name} added to workbench`);
      onDrop();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleItemDragStart = (itemId: string) => {
    setDraggedWorkbenchItem(itemId);
  };

  const handleItemDragEnd = () => {
    setDraggedWorkbenchItem(null);
  };

  const handleItemDrop = (e: React.DragEvent, targetId: string) => {
    e.stopPropagation();
    
    if (draggedWorkbenchItem && draggedWorkbenchItem !== targetId) {
      toast.info("Items combined");
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.info("Item removed from workbench");
  };

  const duplicateItem = (item: WorkbenchItem) => {
    const newItem = {
      ...item,
      id: `${item.id}-copy-${Date.now()}`,
      x: item.x + 50,
      y: item.y + 50,
    };
    setItems([...items, newItem]);
    toast.success("Item duplicated");
  };

  const clearWorkbench = () => {
    setItems([]);
    toast.info("Workbench cleared");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className="flex-1 bg-lab-workbench relative overflow-hidden"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Tabletop surface */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-[hsl(var(--lab-tabletop))] border-t-2 border-[hsl(var(--lab-tabletop-edge))]" />
          
          {items.map((item) => (
            <ContextMenu key={item.id}>
              <ContextMenuTrigger asChild>
                <Card
                  draggable
                  onDragStart={() => handleItemDragStart(item.id)}
                  onDragEnd={handleItemDragEnd}
                  onDrop={(e) => handleItemDrop(e, item.id)}
                  onDragOver={(e) => e.preventDefault()}
                  className="absolute p-4 cursor-move hover:shadow-lg transition-shadow bg-card"
                  style={{ left: item.x, top: item.y }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <item.icon className="h-12 w-12 text-primary" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </Card>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => duplicateItem(item)}>
                  Duplicate
                </ContextMenuItem>
                <ContextMenuItem>Detail View</ContextMenuItem>
                <ContextMenuItem>Thermal properties...</ContextMenuItem>
                <ContextMenuItem>Rename</ContextMenuItem>
                <ContextMenuItem onClick={() => removeItem(item.id)} className="text-destructive">
                  Remove
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
          
          {items.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <p className="text-lg">Drag items from the stockroom to begin</p>
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={clearWorkbench}>Clear Workbench</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
