import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenTool } from 'lucide-react';
import { toast } from 'sonner';
const Auth = () => {
  const {
    isAuthenticated,
    loading,
    login,
    signup
  } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>;
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        const {
          error
        } = await login(formData.email, formData.password);
        if (error) {
          toast.error(error.message === 'Invalid login credentials' ? 'Email ou senha incorretos' : 'Erro ao fazer login. Tente novamente.');
        } else {
          toast.success('Login realizado com sucesso!');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('As senhas não coincidem');
          setIsSubmitting(false);
          return;
        }
        if (formData.password.length < 6) {
          toast.error('A senha deve ter no mínimo 6 caracteres');
          setIsSubmitting(false);
          return;
        }
        const {
          error
        } = await signup(formData.name, formData.email, formData.password);
        if (error) {
          toast.error(error.message === 'User already registered' ? 'Este email já está cadastrado' : 'Erro ao criar conta. Tente novamente.');
        } else {
          toast.success('Conta criada com sucesso!');
        }
      }
    } catch (error) {
      toast.error('Erro ao autenticar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-2">Selena Ravelyn</h1>
            <p className="text-muted-foreground">Seu escritório literário digital</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input id="name" type="text" placeholder="Seu nome" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} required={!isLogin} />
              </div>}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={e => setFormData({
              ...formData,
              email: e.target.value
            })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({
              ...formData,
              password: e.target.value
            })} required />
            </div>

            {!isLogin && <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({
              ...formData,
              confirmPassword: e.target.value
            })} required={!isLogin} />
              </div>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? isLogin ? 'Entrando...' : 'Criando conta...' : isLogin ? 'Entrar' : 'Criar conta'}
            </Button>

            <div className="text-center">
              
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Illustration (desktop only) */}
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-8">
        
      </div>
    </div>;
};
export default Auth;