import { useApp } from '@/contexts/AppContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Users, TrendingUp, Target, Flame } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Statistics = () => {
  const { stories, characters } = useApp();

  const totalWords = stories.reduce((sum, story) => sum + story.wordCount, 0);
  const totalChapters = stories.reduce((sum, story) => sum + story.chapters.length, 0);
  const activeStories = stories.filter(s => s.status === 'in-progress').length;
  
  // Mock data para gráficos (em produção viria do banco)
  const dailyProgress = [
    { day: 'Seg', words: 1200 },
    { day: 'Ter', words: 850 },
    { day: 'Qua', words: 2100 },
    { day: 'Qui', words: 1650 },
    { day: 'Sex', words: 1900 },
    { day: 'Sáb', words: 2400 },
    { day: 'Dom', words: 1100 },
  ];

  const monthlyTrend = [
    { month: 'Jan', words: 12000 },
    { month: 'Fev', words: 19000 },
    { month: 'Mar', words: 15000 },
    { month: 'Abr', words: 28000 },
    { month: 'Mai', words: 22000 },
    { month: 'Jun', words: 31000 },
  ];

  const storiesData = stories.map(story => ({
    name: story.title.length > 15 ? story.title.substring(0, 15) + '...' : story.title,
    words: story.wordCount,
    chapters: story.chapters.length,
  }));

  const dailyGoal = 1500;
  const todayWords = dailyProgress[dailyProgress.length - 1].words;
  const goalProgress = Math.min((todayWords / dailyGoal) * 100, 100);

  const stats = [
    {
      title: 'Total de Palavras',
      value: totalWords.toLocaleString(),
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Histórias Ativas',
      value: activeStories,
      icon: BookOpen,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Capítulos Escritos',
      value: totalChapters,
      icon: FileText,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Personagens Criados',
      value: characters.length,
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-display font-bold">Estatísticas</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Meta Diária */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Meta Diária
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {todayWords} / {dailyGoal} palavras ({goalProgress.toFixed(0)}%)
                </p>
              </div>
              {goalProgress >= 100 && (
                <div className="flex items-center gap-1 text-success">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold">Meta alcançada!</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
              <div 
                className="h-full gradient-primary transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progresso Semanal */}
          <Card>
            <CardHeader>
              <CardTitle>Progresso Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyProgress}>
                  <defs>
                    <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="words" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorWords)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Evolução Mensal */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="words" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--secondary))', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Palavras por História */}
        {storiesData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Palavras por História</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={storiesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="words" name="Palavras" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="chapters" name="Capítulos" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Statistics;
