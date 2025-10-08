import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, User, Search } from 'lucide-react';

const Characters = () => {
  const { characters } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const roleColors = {
    protagonist: 'bg-primary/20 text-primary',
    antagonist: 'bg-destructive/20 text-destructive',
    supporting: 'bg-secondary/20 text-secondary',
    other: 'bg-muted text-muted-foreground',
  };

  const roleLabels = {
    protagonist: 'Protagonista',
    antagonist: 'Antagonista',
    supporting: 'Coadjuvante',
    other: 'Outro',
  };

  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display font-bold">Personagens</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Personagem
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar personagem..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Characters Grid */}
        {filteredCharacters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharacters.map((character) => (
              <div
                key={character.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {character.avatar ? (
                      <img
                        src={character.avatar}
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{character.name}</h3>
                    <Badge className={roleColors[character.role]}>
                      {roleLabels[character.role]}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {character.age && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Idade:</span> {character.age}
                    </p>
                  )}
                  {character.physicalDescription && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {character.physicalDescription}
                    </p>
                  )}
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Ver Ficha Completa
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum personagem ainda</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando seus primeiros personagens
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Personagem
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Characters;
