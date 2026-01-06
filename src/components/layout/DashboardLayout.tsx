import { ReactNode } from 'react';
import { TopNav } from './TopNav';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container py-6 px-4 md:px-6">
        {children}
      </main>
    </div>
  );
}
