import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-2xl space-y-6">
        <h1 className="text-3xl font-display font-bold">Configurações</h1>

        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Gerencie suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" defaultValue={user?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" defaultValue={user?.email} />
            </div>
            <Button>Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a interface do StoryLab</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Tema</Label>
                <p className="text-sm text-muted-foreground">
                  {theme === 'light' ? 'Claro' : 'Escuro'}
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Altere sua senha</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>Alterar Senha</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
