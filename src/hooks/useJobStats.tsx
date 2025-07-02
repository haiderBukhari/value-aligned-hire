
import { useQuery } from '@tanstack/react-query';

const stages = [
  "Application Screening",
  "Initial Interview", 
  "Assessment",
  "Secondary Interview",
  "Final Interview",
  "Offer Stage"
];

export const useJobStats = (jobId?: string) => {
  const { data: stageStats, isLoading } = useQuery({
    queryKey: ['job-stats', jobId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const statsPromises = stages.map(async (stage) => {
        const url = jobId 
          ? `https://talo-recruitment.vercel.app/jobs/${jobId}`
          : 'https://talo-recruitment.vercel.app/jobs';
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stage }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${stage} stats`);
        }

        const data = await response.json();
        
        if (jobId) {
          // Single job response
          return {
            stage,
            count: data.resume_count_in_stage || 0
          };
        } else {
          // All jobs response - sum up counts across all jobs
          const totalCount = data.jobs?.reduce((sum: number, job: any) => 
            sum + (job.resume_count_in_stage || 0), 0) || 0;
          return {
            stage,
            count: totalCount
          };
        }
      });

      const results = await Promise.all(statsPromises);
      return results.reduce((acc, { stage, count }) => {
        acc[stage] = count;
        return acc;
      }, {} as Record<string, number>);
    },
    enabled: true,
  });

  return {
    stageStats: stageStats || {},
    isLoading,
    stages
  };
};
