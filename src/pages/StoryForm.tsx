import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp, Story } from '@/contexts/AppContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Plus, Edit, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';

const StoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { stories, addStory, updateStory, deleteChapter } = useApp();
  const isNew = id === 'new';
  const story = stories.find(s => s.id === id);
  
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    synopsis: '',
    status: 'draft' as Story['status'],
    startDate: new Date().toISOString().split('T')[0],
    coverImage: '',
    notes: '',
  });

  useEffect(() => {
    if (!isNew && story) {
      setFormData({
        title: story.title,
        genre: story.genre,
        synopsis: story.synopsis,
        status: story.status,
        startDate: story.startDate,
        coverImage: story.coverImage || '',
        notes: story.notes,
      });
    }
  }, [id, isNew, story]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }

    const storyData = {
      ...formData,
      chapters: [],
      characters: [],
      wordCount: 0,
    };

    if (isNew) {
      addStory(storyData);
      toast.success('História criada com sucesso!');
    } else if (id) {
      updateStory(id, storyData);
      toast.success('História atualizada com sucesso!');
    }

    navigate('/dashboard');
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (id && confirm('Deseja realmente excluir este capítulo?')) {
      deleteChapter(id, chapterId);
      toast.success('Capítulo excluído!');
    }
  };

  const statusColors = {
    draft: 'bg-muted text-muted-foreground',
    review: 'bg-warning/20 text-warning',
    published: 'bg-success/20 text-success',
  };

  const statusLabels = {
    draft: 'Rascunho',
    review: 'Revisão',
    published: 'Publicado',
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-display font-bold">
            {isNew ? 'Nova História' : 'Editar História'}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Informações</TabsTrigger>
              <TabsTrigger value="chapters" disabled={isNew}>Capítulos</TabsTrigger>
              <TabsTrigger value="characters" disabled={isNew}>Personagens</TabsTrigger>
              <TabsTrigger value="notes">Notas</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="O título da sua história"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Gênero</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="Ex: Romance, Fantasia, Terror"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Story['status']) => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="in-progress">Em Andamento</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="paused">Pausada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="synopsis">Sinopse</Label>
                <Textarea
                  id="synopsis"
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  placeholder="Uma breve descrição da sua história..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.synopsis.length} caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">URL da Capa</Label>
                <Input
                  id="coverImage"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="chapters" className="space-y-6">
              {!isNew && story && (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {story.chapters.length} {story.chapters.length === 1 ? 'Capítulo' : 'Capítulos'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {story.wordCount.toLocaleString()} palavras no total
                      </p>
                    </div>
                    <Button 
                      type="button"
                      onClick={() => navigate(`/chapter/${story.id}/new`)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Capítulo
                    </Button>
                  </div>

                  {story.chapters.length > 0 ? (
                    <div className="space-y-3">
                      {story.chapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  Capítulo {chapter.number}: {chapter.title}
                                </h4>
                                <Badge className={statusColors[chapter.status]}>
                                  {statusLabels[chapter.status]}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {chapter.wordCount} palavras • 
                                Última edição: {new Date(chapter.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/chapter/${story.id}/${chapter.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteChapter(chapter.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum capítulo ainda</h3>
                      <p className="text-muted-foreground mb-4">
                        Comece escrevendo o primeiro capítulo da sua história
                      </p>
                      <Button 
                        type="button"
                        onClick={() => navigate(`/chapter/${story.id}/new`)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Capítulo
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="characters" className="space-y-6">
              {!isNew && story && (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {story.characters.length} {story.characters.length === 1 ? 'Personagem' : 'Personagens'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Gerencie os personagens desta história
                      </p>
                    </div>
                    <Button 
                      type="button"
                      onClick={() => navigate('/characters')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Personagem
                    </Button>
                  </div>

                  {story.characters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Aqui serão exibidos os personagens */}
                      <p className="col-span-full text-center text-muted-foreground">
                        Funcionalidade de visualização de personagens em desenvolvimento
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                      <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum personagem ainda</h3>
                      <p className="text-muted-foreground mb-4">
                        Adicione personagens para enriquecer sua história
                      </p>
                      <Button 
                        type="button"
                        onClick={() => navigate('/characters')}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Primeiro Personagem
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="notes">Notas sobre a história</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ideias, cronologia, pesquisas..."
                  rows={12}
                  className="font-editor"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default StoryForm;
