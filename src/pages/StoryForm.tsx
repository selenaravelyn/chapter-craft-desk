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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Save, Plus, Edit, Trash2, FileText, User, X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const StoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stories, characters, addStory, updateStory, deleteChapter } = useApp();
  const isNew = id === 'new';
  const story = stories.find(s => s.id === id);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  
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

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Formato inválido. Use JPG, PNG, WEBP ou GIF');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      toast.error('Arquivo muito grande. Tamanho máximo: 5MB');
      return;
    }

    setUploadingCover(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('story-covers')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('story-covers')
        .getPublicUrl(fileName);

      setFormData({ ...formData, coverImage: publicUrl });
      toast.success('Capa carregada com sucesso!');
    } catch (error) {
      console.error('Error uploading cover:', error);
      toast.error('Erro ao fazer upload da capa');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (id && confirm('Deseja realmente excluir este capítulo?')) {
      deleteChapter(id, chapterId);
      toast.success('Capítulo excluído!');
    }
  };

  const handleAddCharacterToStory = (characterId: string) => {
    if (!id || !story) return;
    
    if (story.characters.includes(characterId)) {
      toast.error('Personagem já adicionado a esta história');
      return;
    }

    updateStory(id, {
      ...story,
      characters: [...story.characters, characterId],
    });
    toast.success('Personagem adicionado à história!');
  };

  const handleRemoveCharacterFromStory = (characterId: string) => {
    if (!id || !story) return;

    updateStory(id, {
      ...story,
      characters: story.characters.filter(cId => cId !== characterId),
    });
    toast.success('Personagem removido da história!');
  };

  const storyCharacters = characters.filter(c => story?.characters.includes(c.id));
  const availableCharacters = characters.filter(c => !story?.characters.includes(c.id));

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
                <Label>Capa da História</Label>
                
                {formData.coverImage && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border mb-3">
                    <img 
                      src={formData.coverImage} 
                      alt="Capa" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData({ ...formData, coverImage: '' })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="coverImageFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingCover}
                      onClick={() => document.getElementById('coverImageFile')?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadingCover ? 'Enviando...' : 'Fazer Upload de Imagem'}
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Ou insira uma URL:
                </div>
                
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
                      onClick={() => setShowCharacterModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Personagem
                    </Button>
                  </div>

                  {story.characters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {storyCharacters.map((character) => (
                        <div key={character.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={character.avatar} />
                              <AvatarFallback>
                                <User className="w-6 h-6" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate">{character.name}</h4>
                              <p className="text-sm text-muted-foreground">{character.age}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveCharacterFromStory(character.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <Badge variant={
                            character.role === 'protagonist' ? 'default' :
                            character.role === 'antagonist' ? 'destructive' :
                            'secondary'
                          }>
                            {character.role === 'protagonist' ? 'Protagonista' :
                             character.role === 'antagonist' ? 'Antagonista' :
                             character.role === 'supporting' ? 'Coadjuvante' : 'Outro'}
                          </Badge>
                        </div>
                      ))}
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
                        onClick={() => setShowCharacterModal(true)}
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

        <Dialog open={showCharacterModal} onOpenChange={setShowCharacterModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">
                Adicionar Personagens à História
              </DialogTitle>
            </DialogHeader>

            {availableCharacters.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {availableCharacters.map((character) => (
                  <div
                    key={character.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={character.avatar} />
                      <AvatarFallback>
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{character.name}</h4>
                      <p className="text-sm text-muted-foreground">{character.age}</p>
                      <div className="mt-1">
                        <Badge variant={
                          character.role === 'protagonist' ? 'default' :
                          character.role === 'antagonist' ? 'destructive' :
                          'secondary'
                        }>
                          {character.role === 'protagonist' ? 'Protagonista' :
                           character.role === 'antagonist' ? 'Antagonista' :
                           character.role === 'supporting' ? 'Coadjuvante' : 'Outro'}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        handleAddCharacterToStory(character.id);
                        setShowCharacterModal(false);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Nenhum personagem disponível</h3>
                <p className="text-muted-foreground mb-4">
                  Crie novos personagens na página de Personagens
                </p>
                <Button onClick={() => {
                  setShowCharacterModal(false);
                  navigate('/characters');
                }}>
                  Ir para Personagens
                </Button>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCharacterModal(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default StoryForm;
