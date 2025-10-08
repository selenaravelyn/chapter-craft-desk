import { useApp } from '@/contexts/AppContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Users, TrendingUp } from 'lucide-react';

const Statistics = () => {
  const { stories, characters } = useApp();

  const totalWords = stories.reduce((sum, story) => sum + story.wordCount, 0);
  const totalChapters = stories.reduce((sum, story) => sum + story.chapters.length, 0);
  const activeStories = stories.filter(s => s.status === 'in-progress').length;

  const stats = [
    {
      title: 'Total de Palavras',
      value: totalWords.toLocaleString(),
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      title: 'Histórias Ativas',
      value: activeStories,
      icon: BookOpen,
      color: 'text-secondary',
    },
    {
      title: 'Capítulos Escritos',
      value: totalChapters,
      icon: FileText,
      color: 'text-accent',
    },
    {
      title: 'Personagens Criados',
      value: characters.length,
      icon: Users,
      color: 'text-success',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-display font-bold">Estatísticas</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suas Histórias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold">{story.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {story.chapters.length} capítulos • {story.wordCount.toLocaleString()} palavras
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {story.wordCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">palavras</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Statistics;
