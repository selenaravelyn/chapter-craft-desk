import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

const Notes = () => {
  const { notes } = useApp();

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display font-bold">Notas & Rascunhos</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Nota
          </Button>
        </div>

        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="font-bold mb-2 line-clamp-1">{note.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {note.content}
                </p>
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma nota ainda</h3>
            <p className="text-muted-foreground mb-4">
              Comece anotando suas ideias e inspirações
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Nota
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notes;
