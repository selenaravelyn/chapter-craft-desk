import { useState, useEffect } from 'react';
import { useApp, Character } from '@/contexts/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface CharacterFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characterId?: string;
  storyId?: string;
}

const CharacterForm = ({ open, onOpenChange, characterId, storyId }: CharacterFormProps) => {
  const { characters, stories, addCharacter, updateCharacter } = useApp();
  const character = characterId ? characters.find(c => c.id === characterId) : null;

  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    age: '',
    role: 'other' as Character['role'],
    physicalDescription: '',
    personality: '',
    backstory: '',
    relationships: '',
    storyIds: storyId ? [storyId] : [] as string[],
  });

  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name,
        avatar: character.avatar || '',
        age: character.age,
        role: character.role,
        physicalDescription: character.physicalDescription,
        personality: character.personality,
        backstory: character.backstory,
        relationships: character.relationships,
        storyIds: character.storyIds,
      });
    } else {
      setFormData({
        name: '',
        avatar: '',
        age: '',
        role: 'other',
        physicalDescription: '',
        personality: '',
        backstory: '',
        relationships: '',
        storyIds: storyId ? [storyId] : [],
      });
    }
  }, [character, open, storyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('O nome é obrigatório');
      return;
    }

    if (characterId) {
      updateCharacter(characterId, formData);
      toast.success('Personagem atualizado!');
    } else {
      addCharacter(formData);
      toast.success('Personagem criado!');
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            {characterId ? 'Editar Personagem' : 'Novo Personagem'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do personagem"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Ex: 25 anos"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Papel</Label>
              <Select
                value={formData.role}
                onValueChange={(value: Character['role']) => 
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="protagonist">Protagonista</SelectItem>
                  <SelectItem value="antagonist">Antagonista</SelectItem>
                  <SelectItem value="supporting">Coadjuvante</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">URL da Foto</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="physicalDescription">Descrição Física</Label>
            <Textarea
              id="physicalDescription"
              value={formData.physicalDescription}
              onChange={(e) => setFormData({ ...formData, physicalDescription: e.target.value })}
              placeholder="Cabelos castanhos, olhos verdes, 1,75m de altura..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personality">Personalidade</Label>
            <Textarea
              id="personality"
              value={formData.personality}
              onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              placeholder="Corajosa, determinada, mas com medo de altura..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backstory">História de Fundo (Backstory)</Label>
            <Textarea
              id="backstory"
              value={formData.backstory}
              onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
              placeholder="Cresceu em uma pequena vila, perdeu os pais cedo..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationships">Relacionamentos</Label>
            <Textarea
              id="relationships"
              value={formData.relationships}
              onChange={(e) => setFormData({ ...formData, relationships: e.target.value })}
              placeholder="Irmã de João, amiga de Maria, inimiga de Pedro..."
              rows={3}
            />
          </div>

          {!storyId && (
            <div className="space-y-2">
              <Label htmlFor="stories">Histórias Associadas</Label>
              <Select
                value=""
                onValueChange={(value) => {
                  if (!formData.storyIds.includes(value)) {
                    setFormData({ ...formData, storyIds: [...formData.storyIds, value] });
                  }
                }}
              >
                <SelectTrigger id="stories" className="bg-background">
                  <SelectValue placeholder="Selecione as histórias" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {stories.filter(story => !formData.storyIds.includes(story.id)).map((story) => (
                    <SelectItem key={story.id} value={story.id}>
                      {story.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.storyIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.storyIds.map((storyId) => {
                    const story = stories.find(s => s.id === storyId);
                    return story ? (
                      <Badge key={storyId} variant="secondary" className="gap-2">
                        {story.title}
                        <button
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            storyIds: formData.storyIds.filter(id => id !== storyId) 
                          })}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {characterId ? 'Salvar Alterações' : 'Criar Personagem'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterForm;
