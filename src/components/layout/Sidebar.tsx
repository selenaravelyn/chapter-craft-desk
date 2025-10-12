import { Link, useLocation } from 'react-router-dom';
import { BookOpen, PenTool, Users, FileText, BarChart3, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
const Sidebar = ({
  isOpen,
  onClose
}: SidebarProps) => {
  const location = useLocation();
  const {
    logout
  } = useAuth();
  const menuItems = [{
    icon: BookOpen,
    label: 'Minhas Histórias',
    path: '/dashboard'
  }, {
    icon: Users,
    label: 'Personagens',
    path: '/characters'
  }, {
    icon: FileText,
    label: 'Notas & Rascunhos',
    path: '/notes'
  }, {
    icon: BarChart3,
    label: 'Estatísticas',
    path: '/statistics'
  }, {
    icon: Settings,
    label: 'Configurações',
    path: '/settings'
  }];
  const isActive = (path: string) => location.pathname === path;
  return <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      
      {/* Sidebar */}
      <aside className={cn("fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border transition-transform duration-300 flex flex-col", isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="flex items-center">
              <PenTool className="w-8 h-8 text-primary" />
            </Link>
            <h1 className="text-xl font-semibold">Selena Ravelyn</h1>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map(item => <Link key={item.path} to={item.path} onClick={() => onClose()} className={cn("flex items-center space-x-3 px-4 py-3 rounded-lg transition-all", isActive(item.path) ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted text-muted-foreground hover:text-foreground")}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>)}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button onClick={() => {
          logout();
          onClose();
        }} className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>;
};
export default Sidebar;