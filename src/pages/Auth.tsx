import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenTool } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const { isAuthenticated, login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Login realizado com sucesso!');
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('As senhas não coincidem');
          return;
        }
        await signup(formData.name, formData.email, formData.password);
        toast.success('Conta criada com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao autenticar. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-2">StoryLab</h1>
            <p className="text-muted-foreground">Seu escritório literário digital</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required={!isLogin}
                />
              </div>
            )}

            <Button type="submit" className="w-full">
              {isLogin ? 'Entrar' : 'Criar conta'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline text-sm"
              >
                {isLogin ? 'Não tem uma conta? Criar agora' : 'Já tem uma conta? Entrar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Illustration (desktop only) */}
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-8">
        <div className="text-center text-white space-y-6 max-w-lg">
          <h2 className="text-5xl font-display font-bold">
            Transforme suas ideias em histórias incríveis
          </h2>
          <p className="text-xl text-white/90">
            Organize suas histórias, personagens e capítulos em um único lugar
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
