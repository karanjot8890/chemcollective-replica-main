import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Beaker, FlaskConical, TestTube, TestTubeDiagonal, Pipette, FlaskRound, Minus, Circle, Flame, Filter, Wind, Cylinder, ChevronDown, Scale, Thermometer, Calculator, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const solutions = [
  { id: "water", name: "Water", icon: Beaker },
  { id: "nacl", name: "NaCl Solution", icon: FlaskConical },
  { id: "hcl", name: "HCl Solution", icon: TestTube },
  { id: "naoh", name: "NaOH Solution", icon: FlaskConical },
];

const glassware = [
  { id: "beaker", name: "Beaker", icon: Beaker, volumes: ["50ml", "100ml", "250ml", "500ml"] },
  { id: "conical-flask", name: "Conical Flask", icon: FlaskConical, volumes: ["50ml", "100ml", "250ml", "500ml"] },
  { id: "test-tube", name: "Test Tube (10ml)", icon: TestTube },
  { id: "boiling-tube", name: "Boiling Tube (20ml)", icon: TestTubeDiagonal },
  { 
    id: "pipette", 
    name: "Pipette with Pump", 
    icon: Pipette, 
    types: ["Volumetric", "Graduated"],
    volumes: ["1ml", "2ml", "5ml", "10ml", "20ml", "25ml", "50ml", "100ml"]
  },
  { id: "volumetric-flask", name: "Volumetric Flask", icon: FlaskRound, volumes: ["50ml", "100ml", "250ml", "500ml"] },
  { id: "stirring-rod", name: "Glass Stirring Rod", icon: Minus },
  { id: "watch-glass", name: "Watch Glass", icon: Circle },
  { id: "crucible", name: "Porcelain Crucible with Lid", icon: Flame },
  { id: "funnel", name: "Glass Funnel", icon: Filter },
  { id: "condenser", name: "Liebig Condenser", icon: Wind },
  { id: "measuring-cylinder", name: "Measuring Cylinder", icon: Cylinder, volumes: ["10ml", "25ml", "50ml", "100ml"] },
  { id: "burette", name: "Burette (100ml)", icon: TestTube },
];

const tools = [
  { id: "scale", name: "Digital Scale", icon: Scale },
  { id: "thermometer", name: "Thermometer", icon: Thermometer },
  { id: "calculator", name: "Calculator", icon: Calculator },
];

interface StockroomProps {
  onItemDragStart: (item: any) => void;
}

export const Stockroom = ({ onItemDragStart }: StockroomProps) => {
  const [activeTab, setActiveTab] = useState("solutions");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});

  const handleOptionSelect = (itemId: string, optionType: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [optionType]: value
      }
    }));
  };

  const renderItems = (items: any[]) => (
    <div className="grid grid-cols-2 gap-2 p-2">
      {items.map((item) => (
        <Card
          key={item.id}
          draggable={!item.volumes && !item.types}
          onDragStart={() => onItemDragStart({ ...item, ...selectedOptions[item.id] })}
          className="p-3 hover:bg-lab-item-hover transition-colors border-lab-stockroom-border"
        >
          <div className="flex flex-col items-center gap-2">
            <item.icon className="h-8 w-8 text-primary" />
            <span className="text-xs text-center font-medium">{item.name}</span>
            
            {item.types && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full text-xs h-7">
                    {selectedOptions[item.id]?.type || "Type"}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background z-50">
                  {item.types.map((type: string) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => handleOptionSelect(item.id, "type", type)}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {item.volumes && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full text-xs h-7">
                    {selectedOptions[item.id]?.volume || "Volume"}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background z-50">
                  {item.volumes.map((volume: string) => (
                    <DropdownMenuItem
                      key={volume}
                      onClick={() => handleOptionSelect(item.id, "volume", volume)}
                    >
                      {volume}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="w-80 bg-lab-stockroom border-r border-lab-stockroom-border flex flex-col h-full min-h-0 overflow-hidden">
      <div className="p-4 border-b border-lab-stockroom-border flex items-center justify-between">
        <h2 className="text-sm font-semibold">Stockroom</h2>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-4 w-4 text-accent" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full grid grid-cols-3 rounded-none bg-muted/50">
          <TabsTrigger value="solutions" className="text-xs">
            <Beaker className="h-4 w-4 mr-1" />
            Solutions
          </TabsTrigger>
          <TabsTrigger value="glassware" className="text-xs">
            <FlaskConical className="h-4 w-4 mr-1" />
            Glassware
          </TabsTrigger>
          <TabsTrigger value="tools" className="text-xs">
            <Scale className="h-4 w-4 mr-1" />
            Tools
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1">
          <TabsContent value="solutions" className="m-0">
            {renderItems(solutions)}
          </TabsContent>
          
          <TabsContent value="glassware" className="m-0">
            {renderItems(glassware)}
          </TabsContent>
          
          <TabsContent value="tools" className="m-0">
            {renderItems(tools)}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
