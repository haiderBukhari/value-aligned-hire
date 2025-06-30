
import { useState, useEffect } from 'react';

interface CompanyInfo {
  company_name: string;
}

export const useCompanyInfo = () => {
  const [companyName, setCompanyName] = useState<string>('Company');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        }
      } catch (error) {
        console.error('Error fetching company info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  return { companyName, loading };
};
