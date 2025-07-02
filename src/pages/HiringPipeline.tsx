
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Settings, Plus, Trash2, GripVertical, CheckCircle, Users, Trophy, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const HiringPipeline = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Available stages that can be added
  const availableStages = [
    { id: "initial-interview", name: "Initial Interview", description: "First round interview" },
    { id: "secondary-interview", name: "Secondary Interview", description: "Second round interview" },
    { id: "assessment", name: "Assessment", description: "Technical or skills assessment" },
  ];

  // Current pipeline configuration
  const [pipelineStages, setPipelineStages] = useState([
    {
      id: "application-screening",
      name: "Application Screening",
      description: "Initial review of applications",
      isMandatory: true,
      order: 1
    },
    {
      id: "final-interview",
      name: "Final Interview",
      description: "Final decision interview",
      isMandatory: true,
      order: 2
    },
    {
      id: "offer-stage",
      name: "Offer Stage",
      description: "Extending and negotiating offers",
      isMandatory: true,
      order: 3
    }
  ]);

  // Convert pipeline stages to workflow format
  const convertToWorkflowFormat = (stages: any[]) => {
    const workflow: any = {};
    stages.forEach((stage, index) => {
      workflow[`step${index + 1}`] = stage.name;
    });
    return workflow;
  };

  // Convert workflow format to pipeline stages
  const convertFromWorkflowFormat = (workflowProcess: any) => {
    const stages = [];
    const stepKeys = Object.keys(workflowProcess).sort((a, b) => {
      const numA = parseInt(a.replace('step', ''));
      const numB = parseInt(b.replace('step', ''));
      return numA - numB;
    });

    stepKeys.forEach((stepKey, index) => {
      const stepName = workflowProcess[stepKey];
      let stageId = stepName.toLowerCase().replace(/\s+/g, '-');
      let isMandatory = false;

      // Determine if stage is mandatory based on name
      if (stepName.includes('Application Screening') || stepName.includes('Final Interview') || stepName.includes('Offer Stage')) {
        isMandatory = true;
      }

      stages.push({
        id: stageId,
        name: stepName,
        description: getStageDescription(stepName),
        isMandatory,
        order: index + 1
      });
    });

    return stages;
  };

  const getStageDescription = (stageName: string) => {
    const descriptions: any = {
      'Application Screening': 'Initial review of applications',
      'Assessment': 'Technical or skills assessment',
      'Initial Interview': 'First round interview',
      'Secondary Interview': 'Second round interview',
      'Final Interview': 'Final decision interview',
      'Offer Stage': 'Extending and negotiating offers'
    };
    return descriptions[stageName] || 'Custom stage';
  };

  // Fetch workflow from API
  const fetchWorkflow = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access your workflow.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/workflow`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.workflow && data.workflow.workflow_process) {
          const stages = convertFromWorkflowFormat(data.workflow.workflow_process);
          setPipelineStages(stages);
        }
      } else if (response.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      } else {
        console.error('Failed to fetch workflow:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching workflow:', error);
      toast({
        title: "Error",
        description: "Failed to load workflow. Using default configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save workflow to API
  const saveWorkflow = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save your workflow.",
          variant: "destructive",
        });
        return;
      }

      const workflowProcess = convertToWorkflowFormat(pipelineStages);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/workflow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_process: workflowProcess
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: `Workflow ${data.action === 'created' ? 'created' : 'updated'} successfully!`,
        });
      } else if (response.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Error",
          description: errorData.error || "Failed to save workflow.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: "Error",
        description: "Failed to save workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchWorkflow();
  }, []);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const draggableStages = pipelineStages.filter(stage => !stage.isMandatory);
    const [reorderedItem] = draggableStages.splice(result.source.index, 1);
    draggableStages.splice(result.destination.index, 0, reorderedItem);

    // Rebuild the full pipeline with mandatory stages in fixed positions
    const newPipeline = [];
    
    // Add Application Screening (always first)
    const appScreening = pipelineStages.find(s => s.name === "Application Screening");
    if (appScreening) newPipeline.push(appScreening);
    
    // Add draggable stages
    draggableStages.forEach(stage => newPipeline.push(stage));
    
    // Add Final Interview and Offer Stage (always last two)
    const finalInterview = pipelineStages.find(s => s.name === "Final Interview");
    const offerStage = pipelineStages.find(s => s.name === "Offer Stage");
    if (finalInterview) newPipeline.push(finalInterview);
    if (offerStage) newPipeline.push(offerStage);

    // Update order numbers
    const updatedItems = newPipeline.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setPipelineStages(updatedItems);
  };

  const addStage = (stageTemplate: any) => {
    const currentStages = [...pipelineStages];
    let insertIndex;

    // Determine insertion order based on stage type
    if (stageTemplate.id === "initial-interview") {
      // Find if secondary interview exists
      const secondaryIndex = currentStages.findIndex(s => s.id === "secondary-interview");
      if (secondaryIndex !== -1) {
        insertIndex = secondaryIndex;
      } else {
        // Insert before final interview
        const finalIndex = currentStages.findIndex(s => s.name === "Final Interview");
        insertIndex = finalIndex !== -1 ? finalIndex : currentStages.length - 2;
      }
    } else if (stageTemplate.id === "secondary-interview") {
      // Insert before final interview
      const finalIndex = currentStages.findIndex(s => s.name === "Final Interview");
      insertIndex = finalIndex !== -1 ? finalIndex : currentStages.length - 2;
    } else {
      // Default: insert before final interview
      const finalIndex = currentStages.findIndex(s => s.name === "Final Interview");
      insertIndex = finalIndex !== -1 ? finalIndex : currentStages.length - 2;
    }

    const newStage = {
      ...stageTemplate,
      isMandatory: false,
      order: insertIndex + 1
    };
    
    currentStages.splice(insertIndex, 0, newStage);
    
    // Update order numbers
    const updatedStages = currentStages.map((stage, index) => ({
      ...stage,
      order: index + 1
    }));
    
    setPipelineStages(updatedStages);
    setIsAddDialogOpen(false);
  };

  const removeStage = (stageId: string) => {
    const updatedStages = pipelineStages
      .filter(stage => stage.id !== stageId)
      .map((stage, index) => ({ ...stage, order: index + 1 }));
    
    setPipelineStages(updatedStages);
  };

  const getAvailableStages = () => {
    const currentStageIds = pipelineStages.map(stage => stage.id);
    return availableStages.filter(stage => !currentStageIds.includes(stage.id));
  };

  const draggableStages = pipelineStages.filter(stage => !stage.isMandatory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading workflow...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-[960px] mx-auto p-6 space-y-8">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Pipeline Stages Configuration</CardTitle>
            <CardDescription>
              Drag and drop to reorder optional stages. Mandatory stages have fixed positions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 w-full">
              {/* Application Screening - Fixed at top */}
              {pipelineStages.filter(stage => stage.name === "Application Screening").map((stage) => (
                <div key={stage.id} className="w-full bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm">
                        {stage.order}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{stage.name}</h3>
                        <p className="text-sm text-gray-600">{stage.description}</p>
                      </div>
                    </div>
                    <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                      Mandatory
                    </Badge>
                  </div>
                </div>
              ))}

              {/* Draggable Optional Stages */}
              {draggableStages.length > 0 && (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="pipeline-stages">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 w-full">
                        {draggableStages.map((stage, index) => (
                          <Draggable key={stage.id} draggableId={stage.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`w-full bg-white border rounded-lg p-6 transition-shadow ${
                                  snapshot.isDragging ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                      <GripVertical className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                      {stage.order}
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900">{stage.name}</h3>
                                      <p className="text-sm text-gray-600">{stage.description}</p>
                                    </div>
                                  </div>
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
              )}

              {/* Final Interview and Offer Stage - Fixed at bottom */}
              {pipelineStages.filter(stage => stage.name === "Final Interview" || stage.name === "Offer Stage").map((stage) => (
                <div key={stage.id} className="w-full bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm">
                        {stage.order}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{stage.name}</h3>
                        <p className="text-sm text-gray-600">{stage.description}</p>
                      </div>
                    </div>
                    <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                      Mandatory
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
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
                <span>{pipelineStages.length} Total Stages</span>
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
            onClick={saveWorkflow}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Save Pipeline Configuration
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HiringPipeline;
