import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Target, Bell } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [preferences, setPreferences] = useState({
    dailyGoal: 1500,
    fontSize: 16,
    autoSave: true,
    notifications: true,
  });

  const handleSavePreferences = () => {
    toast.success('Preferências salvas!');
  };

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
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Metas de Escrita
            </CardTitle>
            <CardDescription>Configure suas metas diárias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="daily-goal">Meta diária de palavras</Label>
                <span className="text-2xl font-bold text-primary">
                  {preferences.dailyGoal}
                </span>
              </div>
              <Slider
                id="daily-goal"
                min={500}
                max={5000}
                step={100}
                value={[preferences.dailyGoal]}
                onValueChange={(value) => 
                  setPreferences({ ...preferences, dailyGoal: value[0] })
                }
              />
              <p className="text-sm text-muted-foreground">
                Recomendado: 1000-2000 palavras por dia
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Notificações de meta</Label>
                <p className="text-sm text-muted-foreground">
                  Receba lembretes sobre suas metas
                </p>
              </div>
              <Switch
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, notifications: checked })
                }
              />
            </div>

            <Button onClick={handleSavePreferences}>
              Salvar Metas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferências do Editor</CardTitle>
            <CardDescription>Personalize sua experiência de escrita</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="font-size">Tamanho da fonte</Label>
                <span className="text-sm font-medium">{preferences.fontSize}px</span>
              </div>
              <Slider
                id="font-size"
                min={12}
                max={24}
                step={1}
                value={[preferences.fontSize]}
                onValueChange={(value) => 
                  setPreferences({ ...preferences, fontSize: value[0] })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-save">Auto-save</Label>
                <p className="text-sm text-muted-foreground">
                  Salvar automaticamente a cada 30 segundos
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={preferences.autoSave}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, autoSave: checked })
                }
              />
            </div>

            <Button onClick={handleSavePreferences}>
              Salvar Preferências
            </Button>
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
