import React, { createContext, useContext, useState } from 'react';

export interface Story {
  id: string;
  title: string;
  genre: string;
  synopsis: string;
  coverImage?: string;
  status: 'draft' | 'in-progress' | 'completed' | 'paused';
  startDate: string;
  chapters: Chapter[];
  characters: string[];
  notes: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  storyId: string;
  number: number;
  title: string;
  content: string;
  wordCount: number;
  status: 'draft' | 'review' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface Character {
  id: string;
  storyIds: string[];
  name: string;
  avatar?: string;
  age: string;
  physicalDescription: string;
  personality: string;
  backstory: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'other';
  relationships: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface AppContextType {
  stories: Story[];
  characters: Character[];
  notes: Note[];
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStory: (id: string, story: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  addChapter: (storyId: string, chapter: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateChapter: (storyId: string, chapterId: string, chapter: Partial<Chapter>) => void;
  deleteChapter: (storyId: string, chapterId: string) => void;
  addCharacter: (character: Omit<Character, 'id' | 'createdAt'>) => void;
  updateCharacter: (id: string, character: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stories, setStories] = useState<Story[]>([
    {
      id: '1',
      title: 'A Bruxa das Sombras',
      genre: 'Fantasia',
      synopsis: 'Uma jovem bruxa descobre seus poderes e precisa salvar seu vilarejo de uma antiga maldição.',
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
      status: 'in-progress',
      startDate: '2024-01-15',
      chapters: [],
      characters: [],
      notes: '',
      wordCount: 15420,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
    },
    {
      id: '2',
      title: 'Corações Entrelaçados',
      genre: 'Romance',
      synopsis: 'Dois corações destinados a se encontrarem em meio ao caos da vida moderna.',
      coverImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400',
      status: 'draft',
      startDate: '2024-02-01',
      chapters: [],
      characters: [],
      notes: '',
      wordCount: 8230,
      createdAt: '2024-02-01',
      updatedAt: '2024-02-05',
    },
  ]);
  
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: 'char1',
      storyIds: [],
      name: 'Luna Silvestre',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      age: '24 anos',
      physicalDescription: 'Cabelos negros longos, olhos verdes penetrantes, 1,68m de altura',
      personality: 'Corajosa e determinada, mas com um lado vulnerável que esconde',
      backstory: 'Cresceu em uma pequena vila nas montanhas, perdeu os pais ainda jovem',
      role: 'protagonist',
      relationships: 'Melhor amiga de Sarah, possui uma relação complexa com Marcus',
      createdAt: '2024-01-10',
    },
    {
      id: 'char2',
      storyIds: [],
      name: 'Marcus Blackwood',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      age: '28 anos',
      physicalDescription: 'Cabelos castanhos escuros, olhos azuis, porte atlético',
      personality: 'Misterioso e reservado, mas leal aos que confia',
      backstory: 'Vem de uma família rica, mas rejeitou a fortuna para seguir seu próprio caminho',
      role: 'supporting',
      relationships: 'Interesse romântico de Luna, rival de Viktor',
      createdAt: '2024-01-11',
    },
  ]);
  const [notes, setNotes] = useState<Note[]>([]);

  const addStory = (story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStory: Story = {
      ...story,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStories(prev => [...prev, newStory]);
  };

  const updateStory = (id: string, story: Partial<Story>) => {
    setStories(prev => prev.map(s => 
      s.id === id ? { ...s, ...story, updatedAt: new Date().toISOString() } : s
    ));
  };

  const deleteStory = (id: string) => {
    setStories(prev => prev.filter(s => s.id !== id));
  };

  const addChapter = (storyId: string, chapter: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newChapter: Chapter = {
      ...chapter,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setStories(prev => prev.map(story => {
      if (story.id === storyId) {
        return {
          ...story,
          chapters: [...story.chapters, newChapter],
          updatedAt: new Date().toISOString(),
        };
      }
      return story;
    }));
  };

  const updateChapter = (storyId: string, chapterId: string, chapter: Partial<Chapter>) => {
    setStories(prev => prev.map(story => {
      if (story.id === storyId) {
        return {
          ...story,
          chapters: story.chapters.map(ch => 
            ch.id === chapterId ? { ...ch, ...chapter, updatedAt: new Date().toISOString() } : ch
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return story;
    }));
  };

  const deleteChapter = (storyId: string, chapterId: string) => {
    setStories(prev => prev.map(story => {
      if (story.id === storyId) {
        return {
          ...story,
          chapters: story.chapters.filter(ch => ch.id !== chapterId),
          updatedAt: new Date().toISOString(),
        };
      }
      return story;
    }));
  };

  const addCharacter = (character: Omit<Character, 'id' | 'createdAt'>) => {
    const newCharacter: Character = {
      ...character,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCharacters(prev => [...prev, newCharacter]);
  };

  const updateCharacter = (id: string, character: Partial<Character>) => {
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, ...character } : c));
  };

  const deleteCharacter = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, note: Partial<Note>) => {
    setNotes(prev => prev.map(n => 
      n.id === id ? { ...n, ...note, updatedAt: new Date().toISOString() } : n
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AppContext.Provider value={{
      stories,
      characters,
      notes,
      addStory,
      updateStory,
      deleteStory,
      addChapter,
      updateChapter,
      deleteChapter,
      addCharacter,
      updateCharacter,
      deleteCharacter,
      addNote,
      updateNote,
      deleteNote,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
