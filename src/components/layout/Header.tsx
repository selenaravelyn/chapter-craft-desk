import { Menu, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full bg-card/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 lg:ml-0 ml-4">
          <h1 className="text-xl font-semibold">
            Olá, <span className="gradient-primary bg-clip-text text-transparent">{user?.name}</span>! 👋
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
