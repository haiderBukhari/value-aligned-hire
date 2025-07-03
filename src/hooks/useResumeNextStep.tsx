
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface NextStepResponse {
  next_step: string;
}

interface MoveToNextStepResponse {
  updated_resume?: any;
  current_step?: string;
  message?: string;
}

export const useResumeNextStep = (resumeId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch next step
  const { data: nextStepData, isLoading: isLoadingNextStep } = useQuery({
    queryKey: ['resume-next-step', resumeId],
    queryFn: async (): Promise<NextStepResponse> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resumes/${resumeId}/next-step`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch next step');
      }

      return response.json();
    },
    enabled: !!resumeId,
  });

  // Move to next step mutation
  const moveToNextStepMutation = useMutation({
    mutationFn: async (): Promise<MoveToNextStepResponse> => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resumes/${resumeId}/next-step`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to move to next step');
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.message === 'Process Complete') {
        toast({
          title: "Process Complete",
          description: "This candidate has completed all hiring stages!",
        });
      } else if (data.current_step) {
        toast({
          title: "Success",
          description: `Candidate moved to ${data.current_step} successfully!`,
        });
      }
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['resume-next-step', resumeId] });
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to move candidate to next step.",
        variant: "destructive",
      });
    },
  });

  return {
    nextStep: nextStepData?.next_step,
    isLoadingNextStep,
    moveToNextStep: moveToNextStepMutation.mutate,
    isMoving: moveToNextStepMutation.isPending,
  };
};
