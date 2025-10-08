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
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const StoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { stories, addStory, updateStory } = useApp();
  const isNew = id === 'new';
  
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
    if (!isNew && id) {
      const story = stories.find(s => s.id === id);
      if (story) {
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
    }
  }, [id, isNew, stories]);

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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Informações Gerais</TabsTrigger>
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
