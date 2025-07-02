
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, GripVertical, Trash2, Save, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useWorkflow } from "@/hooks/useWorkflow";

interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  isMandatory: boolean;
  order: number;
}

const HiringPipeline = () => {
  const { workflowStages, isLoading, isSaving, saveWorkflow, refreshWorkflow } = useWorkflow();
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local stages when workflow data changes
  useEffect(() => {
    if (workflowStages.length > 0) {
      setStages(workflowStages);
      setHasChanges(false);
    }
  }, [workflowStages]);

  const addStage = () => {
    const newStage: WorkflowStage = {
      id: `stage-${Date.now()}`,
      name: "New Stage",
      description: "Add description for this stage",
      isMandatory: false,
      order: stages.length + 1
    };
    const updatedStages = [...stages, newStage];
    setStages(updatedStages);
    setHasChanges(true);
  };

  const updateStage = (id: string, field: keyof WorkflowStage, value: string | boolean) => {
    const updatedStages = stages.map(stage =>
      stage.id === id ? { ...stage, [field]: value } : stage
    );
    setStages(updatedStages);
    setHasChanges(true);
  };

  const removeStage = (id: string) => {
    const stageToRemove = stages.find(stage => stage.id === id);
    if (stageToRemove?.isMandatory) {
      return; // Cannot remove mandatory stages
    }
    
    const updatedStages = stages.filter(stage => stage.id !== id)
      .map((stage, index) => ({ ...stage, order: index + 1 }));
    setStages(updatedStages);
    setHasChanges(true);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedStages = Array.from(stages);
    const [removed] = reorderedStages.splice(result.source.index, 1);
    reorderedStages.splice(result.destination.index, 0, removed);

    const updatedStages = reorderedStages.map((stage, index) => ({
      ...stage,
      order: index + 1
    }));

    setStages(updatedStages);
    setHasChanges(true);
  };

  const handleSave = async () => {
    const success = await saveWorkflow(stages);
    if (success) {
      setHasChanges(false);
      // Trigger sidebar refresh after successful save
      setTimeout(() => {
        refreshWorkflow();
      }, 500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-0 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading hiring pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-0">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Hiring Pipeline Configuration</h1>
              <p className="text-gray-600">Customize your recruitment workflow stages and process</p>
            </div>
            <div className="flex items-center gap-4">
              {hasChanges && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                  Unsaved Changes
                </Badge>
              )}
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Pipeline
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Pipeline Stages */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Pipeline Stages</CardTitle>
              <Button onClick={addStage} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Stage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="stages">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {stages.map((stage, index) => (
                      <Draggable key={stage.id} draggableId={stage.id} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ${
                              snapshot.isDragging ? 'shadow-lg scale-105' : ''
                            }`}
                          >
                            <div className="flex items-start gap-6">
                              <div
                                {...provided.dragHandleProps}
                                className="mt-3 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>

                              <div className="flex-1 space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="px-3 py-1">
                                      Stage {stage.order}
                                    </Badge>
                                    {stage.isMandatory && (
                                      <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                                        <CheckCircle className="mr-1 h-3 w-3" />
                                        Mandatory
                                      </Badge>
                                    )}
                                  </div>
                                  {!stage.isMandatory && (
                                    <Button
                                      onClick={() => removeStage(stage.id)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`name-${stage.id}`} className="text-sm font-medium">
                                      Stage Name
                                    </Label>
                                    <Input
                                      id={`name-${stage.id}`}
                                      value={stage.name}
                                      onChange={(e) => updateStage(stage.id, 'name', e.target.value)}
                                      className="mt-1"
                                      placeholder="Enter stage name"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`desc-${stage.id}`} className="text-sm font-medium">
                                      Description
                                    </Label>
                                    <Input
                                      id={`desc-${stage.id}`}
                                      value={stage.description}
                                      onChange={(e) => updateStage(stage.id, 'description', e.target.value)}
                                      className="mt-1"
                                      placeholder="Enter stage description"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`mandatory-${stage.id}`}
                                    checked={stage.isMandatory}
                                    onCheckedChange={(checked) => updateStage(stage.id, 'isMandatory', checked)}
                                    disabled={stage.isMandatory} // Prevent disabling existing mandatory stages
                                  />
                                  <Label htmlFor={`mandatory-${stage.id}`} className="text-sm">
                                    Make this stage mandatory
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {stages.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">No stages configured yet</p>
                <Button onClick={addStage} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Stage
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium">
                    {stage.name}
                  </div>
                  {index < stages.length - 1 && (
                    <div className="mx-2 text-gray-400">→</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HiringPipeline;
