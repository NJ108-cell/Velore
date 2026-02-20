import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';

export default function Layout({ children, currentPageName }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const { data: progressList } = useQuery({
    queryKey: ['userProgress'],
    queryFn: () => base44.entities.UserProgress.filter({ created_by: user?.email }),
    enabled: !!user?.email,
    initialData: [],
  });

  const progress = progressList?.[0];
  
  const location = progress ? {
    continent: progress.selected_continent,
    country: progress.selected_country,
    state: progress.selected_state,
    city: progress.selected_city
  } : null;

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [currentPageName]);

  // Pages that don't need the header
  const noHeaderPages = ['Onboarding', 'VehicleSelection'];
  const showHeader = !noHeaderPages.includes(currentPageName);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        :root {
          --color-sky: #0ea5e9;
          --color-blue: #3b82f6;
          --color-ocean: #1e40af;
          --color-matte-black: #1a1a2e;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, var(--color-sky), var(--color-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      
      {showHeader && (
        <Header 
          user={user} 
          location={location}
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen(!menuOpen)}
        />
      )}
      
      <main className={showHeader ? 'pt-16' : ''}>
        {children}
      </main>
    </div>
  );
}