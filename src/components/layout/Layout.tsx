import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
