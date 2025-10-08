import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { stories, deleteStory } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');

  const statusColors = {
    draft: 'bg-muted text-muted-foreground',
    'in-progress': 'bg-info/20 text-info',
    completed: 'bg-success/20 text-success',
    paused: 'bg-warning/20 text-warning',
  };

  const statusLabels = {
    draft: 'Rascunho',
    'in-progress': 'Em Andamento',
    completed: 'Concluída',
    paused: 'Pausada',
  };

  const filteredStories = filter === 'all' 
    ? stories 
    : stories.filter(s => s.status === filter);

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'in-progress' ? 'default' : 'outline'}
            onClick={() => setFilter('in-progress')}
          >
            Em Andamento
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilter('draft')}
          >
            Rascunhos
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Concluídas
          </Button>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-muted overflow-hidden">
                {story.coverImage ? (
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className={cn(statusColors[story.status])}>
                    {statusLabels[story.status]}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-xl font-display font-bold mb-1 line-clamp-1">
                    {story.title}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {story.genre}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {story.synopsis}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{story.chapters.length} capítulos</span>
                  <span>{story.wordCount.toLocaleString()} palavras</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/story/${story.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Deseja realmente excluir esta história?')) {
                        deleteStory(story.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Story Card */}
          <button
            onClick={() => navigate('/story/new')}
            className="bg-card border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-all min-h-[400px]"
          >
            <Plus className="w-12 h-12 text-primary mb-2" />
            <span className="text-lg font-semibold">Nova História</span>
          </button>
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => navigate('/story/new')}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-primary text-white shadow-lg hover:shadow-glow transition-all flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>
    </Layout>
  );
};

export default Dashboard;
