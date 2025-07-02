
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NextStepResponse {
  next_step: string;
}

interface AdvanceStepResponse {
  updated_resume?: any;
  current_step?: string;
  message?: string;
}

export const useResumeNextStep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getNextStep = async (resumeId: string): Promise<string | null> => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to continue.",
          variant: "destructive",
        });
        return null;
      }

      const response = await fetch(`https://talo-recruitment.vercel.app/resumes/${resumeId}/next-step`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: NextStepResponse = await response.json();
        return data.next_step;
      } else if (response.status === 404) {
        toast({
          title: "Not Found",
          description: "Resume or workflow not found.",
          variant: "destructive",
        });
      } else if (response.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to get next step.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error getting next step:', error);
      toast({
        title: "Error",
        description: "Failed to get next step. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const advanceToNextStep = async (resumeId: string): Promise<AdvanceStepResponse | null> => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to continue.",
          variant: "destructive",
        });
        return null;
      }

      const response = await fetch(`https://talo-recruitment.vercel.app/resumes/${resumeId}/next-step`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: AdvanceStepResponse = await response.json();
        
        if (data.message === "Process Complete") {
          toast({
            title: "Process Complete",
            description: "This candidate has completed all steps in the hiring process.",
          });
        } else {
          toast({
            title: "Success",
            description: `Candidate moved to ${data.current_step} successfully!`,
          });
        }
        
        return data;
      } else if (response.status === 404) {
        toast({
          title: "Not Found",
          description: "Resume or workflow not found.",
          variant: "destructive",
        });
      } else if (response.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to advance to next step.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error advancing to next step:', error);
      toast({
        title: "Error",
        description: "Failed to advance to next step. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  return {
    getNextStep,
    advanceToNextStep,
    isLoading
  };
};
