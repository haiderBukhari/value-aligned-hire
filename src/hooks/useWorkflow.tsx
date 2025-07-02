
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  isMandatory: boolean;
  order: number;
}

interface WorkflowData {
  id?: string;
  user_id?: string;
  workflow_process: Record<string, string>;
  created_at?: string;
}

export const useWorkflow = () => {
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Convert pipeline stages to workflow format
  const convertToWorkflowFormat = (stages: WorkflowStage[]) => {
    const workflow: Record<string, string> = {};
    stages.forEach((stage, index) => {
      workflow[`step${index + 1}`] = stage.name;
    });
    return workflow;
  };

  // Convert workflow format to pipeline stages
  const convertFromWorkflowFormat = (workflowProcess: Record<string, string>) => {
    const stages: WorkflowStage[] = [];
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
    const descriptions: Record<string, string> = {
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
  const fetchWorkflow = useCallback(async () => {
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
          setWorkflowStages(stages);
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
  }, [toast]);

  // Save workflow to API
  const saveWorkflow = useCallback(async (stages: WorkflowStage[]) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save your workflow.",
          variant: "destructive",
        });
        return false;
      }

      const workflowProcess = convertToWorkflowFormat(stages);

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
        
        // Update local state with saved stages
        setWorkflowStages(stages);
        return true;
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
    return false;
  }, [toast]);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  return {
    workflowStages,
    setWorkflowStages,
    isLoading,
    isSaving,
    fetchWorkflow,
    saveWorkflow,
    convertToWorkflowFormat,
    convertFromWorkflowFormat
  };
};
