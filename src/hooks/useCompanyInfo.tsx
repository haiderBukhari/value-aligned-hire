
import { useState, useEffect, useRef } from 'react';

interface CompanyInfo {
  company_name: string;
  company_details?: string;
}

export const useCompanyInfo = () => {
  const [companyName, setCompanyName] = useState<string>('Company');
  const [companyDetails, setCompanyDetails] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isPopulating, setIsPopulating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCompanyInfo = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/company-info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: CompanyInfo = await response.json();
        setCompanyName(data.company_name || 'Company');
        setCompanyDetails(data.company_details || '');
        
        // If company_details exists, stop polling
        if (data.company_details) {
          setIsPopulating(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else {
          // If company_details doesn't exist, start polling if not already polling
          setIsPopulating(true);
          if (!intervalRef.current) {
            intervalRef.current = setInterval(fetchCompanyInfo, 1000);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyInfo();

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { companyName, companyDetails, loading, isPopulating };
};
