
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Settings, Plus, Trash2, GripVertical, CheckCircle, Clock, Users, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const HiringPipeline = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStageName, setNewStageName] = useState("");

  // Available stages that can be added
  const availableStages = [
    { id: "assessment", name: "Assessment", description: "Technical or skills assessment" },
    { id: "initial-interview", name: "Initial Interview", description: "First round interview" },
    { id: "secondary-interview", name: "Secondary Interview", description: "Second round interview" },
  ];

  // Current pipeline configuration
  const [pipelineStages, setPipelineStages] = useState([
    {
      id: "application-screening",
      name: "Application Screening",
      description: "Initial review of applications",
      isMandatory: true,
      order: 1,
      estimatedDays: 2
    },
    {
      id: "assessment",
      name: "Assessment",
      description: "Technical or skills assessment",
      isMandatory: false,
      order: 2,
      estimatedDays: 3
    },
    {
      id: "final-interview",
      name: "Final Interview",
      description: "Final decision interview",
      isMandatory: true,
      order: 3,
      estimatedDays: 2
    },
    {
      id: "offer-stage",
      name: "Offer Stage",
      description: "Extending and negotiating offers",
      isMandatory: true,
      order: 4,
      estimatedDays: 1
    }
  ]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(pipelineStages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setPipelineStages(updatedItems);
  };

  const addStage = (stageTemplate: any) => {
    const newStage = {
      ...stageTemplate,
      isMandatory: false,
      order: pipelineStages.length + 1,
      estimatedDays: 2
    };
    
    setPipelineStages([...pipelineStages, newStage]);
    setIsAddDialogOpen(false);
  };

  const removeStage = (stageId: string) => {
    const updatedStages = pipelineStages
      .filter(stage => stage.id !== stageId)
      .map((stage, index) => ({ ...stage, order: index + 1 }));
    
    setPipelineStages(updatedStages);
  };

  const updateStageDuration = (stageId: string, days: number) => {
    setPipelineStages(prev => 
      prev.map(stage => 
        stage.id === stageId ? { ...stage, estimatedDays: days } : stage
      )
    );
  };

  const getAvailableStages = () => {
    const currentStageIds = pipelineStages.map(stage => stage.id);
    return availableStages.filter(stage => !currentStageIds.includes(stage.id));
  };

  const totalEstimatedDays = pipelineStages.reduce((sum, stage) => sum + stage.estimatedDays, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hiring Pipeline Configuration</h1>
          <p className="text-gray-600 mt-2">Configure your hiring stages and process flow</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Stage
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Pipeline Stage</DialogTitle>
              <DialogDescription>
                Choose from available stages to add to your hiring pipeline
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {getAvailableStages().map((stage) => (
                <Card key={stage.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => addStage(stage)}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{stage.name}</h4>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </CardContent>
                </Card>
              ))}
              {getAvailableStages().length === 0 && (
                <p className="text-center text-gray-500 py-4">All available stages are already added to your pipeline.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Stages</p>
                <p className="text-3xl font-bold text-gray-900">{pipelineStages.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estimated Timeline</p>
                <p className="text-3xl font-bold text-gray-900">{totalEstimatedDays}d</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mandatory Stages</p>
                <p className="text-3xl font-bold text-gray-900">{pipelineStages.filter(s => s.isMandatory).length}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <CheckCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Optional Stages</p>
                <p className="text-3xl font-bold text-gray-900">{pipelineStages.filter(s => !s.isMandatory).length}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Stages Configuration</CardTitle>
          <CardDescription>
            Drag and drop to reorder stages. Mandatory stages cannot be removed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="pipeline-stages">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {pipelineStages.map((stage, index) => (
                    <Draggable key={stage.id} draggableId={stage.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white border rounded-lg p-6 transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                  {stage.order}
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{stage.name}</h3>
                                  <p className="text-sm text-gray-600">{stage.description}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <label className="text-sm text-gray-600">Duration:</label>
                                <Input
                                  type="number"
                                  value={stage.estimatedDays}
                                  onChange={(e) => updateStageDuration(stage.id, parseInt(e.target.value) || 1)}
                                  className="w-20"
                                  min="1"
                                />
                                <span className="text-sm text-gray-600">days</span>
                              </div>
                              {stage.isMandatory ? (
                                <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                                  Mandatory
                                </Badge>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                                    Optional
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeStage(stage.id)}
                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Pipeline Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Flow Overview</CardTitle>
          <CardDescription>Visual representation of your hiring pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>Pipeline Flow</span>
              <span>Total Duration: {totalEstimatedDays} days</span>
            </div>
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              {pipelineStages.map((stage, index) => (
                <div key={stage.id} className="flex items-center space-x-4 min-w-0">
                  <div className="flex flex-col items-center space-y-2 min-w-32">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                      stage.isMandatory ? 'bg-red-500' : 'bg-blue-500'
                    }`}>
                      {stage.order}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 truncate">{stage.name}</p>
                      <p className="text-xs text-gray-500">{stage.estimatedDays} days</p>
                    </div>
                  </div>
                  {index < pipelineStages.length - 1 && (
                    <div className="flex-shrink-0 w-8 h-0.5 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Save Pipeline Configuration
        </Button>
      </div>
    </div>
  );
};

export default HiringPipeline;
