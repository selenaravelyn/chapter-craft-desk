import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const StoryView = () => {
  const { id } = useParams<{ id: string }>();
  const { stories, characters } = useApp();
  const navigate = useNavigate();

  const story = stories.find(s => s.id === id);

  if (!story) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <p className="text-muted-foreground">História não encontrada</p>
        </div>
      </Layout>
    );
  }

  const storyCharacters = characters.filter(c => story.characters.includes(c.id));

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

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold">{story.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={cn(statusColors[story.status])}>
                {statusLabels[story.status]}
              </Badge>
              <Badge variant="outline">{story.genre}</Badge>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {story.coverImage && (
          <div className="w-full max-w-2xl mx-auto">
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Story Info */}
        <Card>
          <CardHeader>
            <CardTitle>Sinopse</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{story.synopsis}</p>
          </CardContent>
        </Card>

        {/* Characters */}
        {storyCharacters.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Personagens</CardTitle>
              <CardDescription>{storyCharacters.length} personagens nesta história</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storyCharacters.map((character) => (
                  <div
                    key={character.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{character.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {character.age} anos • {character.role}
                      </p>
                      {character.physicalDescription && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {character.physicalDescription}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chapters */}
        <Card>
          <CardHeader>
            <CardTitle>Capítulos</CardTitle>
            <CardDescription>
              {story.chapters.length} capítulo{story.chapters.length !== 1 ? 's' : ''} • {story.wordCount.toLocaleString()} palavras
            </CardDescription>
          </CardHeader>
          <CardContent>
            {story.chapters.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhum capítulo ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {story.chapters.map((chapter, index) => (
                  <div key={chapter.id}>
                    {index > 0 && <Separator className="mb-4" />}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            Capítulo {chapter.number}: {chapter.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {chapter.wordCount.toLocaleString()} palavras
                          </p>
                        </div>
                      </div>
                      <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                        {chapter.content || <em>Sem conteúdo ainda</em>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StoryView;
