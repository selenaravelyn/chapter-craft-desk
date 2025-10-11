import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

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
  loading: boolean;
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateStory: (id: string, story: Partial<Story>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  addChapter: (storyId: string, chapter: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateChapter: (storyId: string, chapterId: string, chapter: Partial<Chapter>) => Promise<void>;
  deleteChapter: (storyId: string, chapterId: string) => Promise<void>;
  addCharacter: (character: Omit<Character, 'id' | 'createdAt'>) => Promise<void>;
  updateCharacter: (id: string, character: Partial<Character>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data when user logs in
  useEffect(() => {
    if (user) {
      fetchAllData();
    } else {
      setStories([]);
      setCharacters([]);
      setNotes([]);
      setLoading(false);
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchStories(),
        fetchCharacters(),
        fetchNotes(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    if (!user) return;

    const { data: storiesData, error: storiesError } = await supabase
      .from('stories')
      .select('*')
      .order('updated_at', { ascending: false });

    if (storiesError) {
      console.error('Error fetching stories:', storiesError);
      return;
    }

    // Fetch chapters for each story
    const storiesWithChapters = await Promise.all(
      (storiesData || []).map(async (story) => {
        const { data: chaptersData } = await supabase
          .from('chapters')
          .select('*')
          .eq('story_id', story.id)
          .order('number', { ascending: true });

        // Fetch story characters
        const { data: storyCharsData } = await supabase
          .from('story_characters')
          .select('character_id')
          .eq('story_id', story.id);

        return {
          id: story.id,
          title: story.title,
          genre: story.genre || '',
          synopsis: story.synopsis || '',
          coverImage: story.cover_image,
          status: story.status as Story['status'],
          startDate: story.start_date,
          notes: story.notes || '',
          wordCount: story.word_count,
          createdAt: story.created_at,
          updatedAt: story.updated_at,
          chapters: (chaptersData || []).map(ch => ({
            id: ch.id,
            storyId: ch.story_id,
            number: ch.number,
            title: ch.title,
            content: ch.content || '',
            wordCount: ch.word_count,
            status: ch.status as Chapter['status'],
            createdAt: ch.created_at,
            updatedAt: ch.updated_at,
          })),
          characters: (storyCharsData || []).map(sc => sc.character_id),
        };
      })
    );

    setStories(storiesWithChapters);
  };

  const fetchCharacters = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching characters:', error);
      return;
    }

    // Fetch story associations for each character
    const charactersWithStories = await Promise.all(
      (data || []).map(async (char) => {
        const { data: storyCharsData } = await supabase
          .from('story_characters')
          .select('story_id')
          .eq('character_id', char.id);

        return {
          id: char.id,
          storyIds: (storyCharsData || []).map(sc => sc.story_id),
          name: char.name,
          avatar: char.avatar,
          age: char.age || '',
          physicalDescription: char.physical_description || '',
          personality: char.personality || '',
          backstory: char.backstory || '',
          role: char.role as Character['role'],
          relationships: char.relationships || '',
          createdAt: char.created_at,
        };
      })
    );

    setCharacters(charactersWithStories);
  };

  const fetchNotes = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return;
    }

    setNotes((data || []).map(note => ({
      id: note.id,
      title: note.title,
      content: note.content || '',
      tags: note.tags || [],
      createdAt: note.created_at,
      updatedAt: note.updated_at,
    })));
  };

  const addStory = async (story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('stories')
      .insert({
        user_id: user.id,
        title: story.title,
        genre: story.genre,
        synopsis: story.synopsis,
        cover_image: story.coverImage,
        status: story.status,
        start_date: story.startDate,
        notes: story.notes,
        word_count: story.wordCount,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding story:', error);
      toast.error('Erro ao criar história');
      return;
    }

    await fetchStories();
  };

  const updateStory = async (id: string, story: Partial<Story>) => {
    if (!user) return;

    const updateData: any = {};
    if (story.title !== undefined) updateData.title = story.title;
    if (story.genre !== undefined) updateData.genre = story.genre;
    if (story.synopsis !== undefined) updateData.synopsis = story.synopsis;
    if (story.coverImage !== undefined) updateData.cover_image = story.coverImage;
    if (story.status !== undefined) updateData.status = story.status;
    if (story.startDate !== undefined) updateData.start_date = story.startDate;
    if (story.notes !== undefined) updateData.notes = story.notes;
    if (story.wordCount !== undefined) updateData.word_count = story.wordCount;

    const { error } = await supabase
      .from('stories')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating story:', error);
      toast.error('Erro ao atualizar história');
      return;
    }

    // Handle character associations if provided
    if (story.characters !== undefined) {
      // Delete existing associations
      await supabase
        .from('story_characters')
        .delete()
        .eq('story_id', id);

      // Insert new associations
      if (story.characters.length > 0) {
        await supabase
          .from('story_characters')
          .insert(
            story.characters.map(charId => ({
              story_id: id,
              character_id: charId,
            }))
          );
      }
    }

    await fetchStories();
  };

  const deleteStory = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting story:', error);
      toast.error('Erro ao deletar história');
      return;
    }

    await fetchStories();
  };

  const addChapter = async (storyId: string, chapter: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const { error } = await supabase
      .from('chapters')
      .insert({
        story_id: storyId,
        number: chapter.number,
        title: chapter.title,
        content: chapter.content,
        word_count: chapter.wordCount,
        status: chapter.status,
      });

    if (error) {
      console.error('Error adding chapter:', error);
      toast.error('Erro ao criar capítulo');
      return;
    }

    await fetchStories();
  };

  const updateChapter = async (storyId: string, chapterId: string, chapter: Partial<Chapter>) => {
    if (!user) return;

    const updateData: any = {};
    if (chapter.number !== undefined) updateData.number = chapter.number;
    if (chapter.title !== undefined) updateData.title = chapter.title;
    if (chapter.content !== undefined) updateData.content = chapter.content;
    if (chapter.wordCount !== undefined) updateData.word_count = chapter.wordCount;
    if (chapter.status !== undefined) updateData.status = chapter.status;

    const { error } = await supabase
      .from('chapters')
      .update(updateData)
      .eq('id', chapterId);

    if (error) {
      console.error('Error updating chapter:', error);
      toast.error('Erro ao atualizar capítulo');
      return;
    }

    await fetchStories();
  };

  const deleteChapter = async (storyId: string, chapterId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', chapterId);

    if (error) {
      console.error('Error deleting chapter:', error);
      toast.error('Erro ao deletar capítulo');
      return;
    }

    await fetchStories();
  };

  const addCharacter = async (character: Omit<Character, 'id' | 'createdAt'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('characters')
      .insert({
        user_id: user.id,
        name: character.name,
        avatar: character.avatar,
        age: character.age,
        physical_description: character.physicalDescription,
        personality: character.personality,
        backstory: character.backstory,
        role: character.role,
        relationships: character.relationships,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding character:', error);
      toast.error('Erro ao criar personagem');
      return;
    }

    // Add story associations if provided
    if (character.storyIds && character.storyIds.length > 0 && data) {
      await supabase
        .from('story_characters')
        .insert(
          character.storyIds.map(storyId => ({
            story_id: storyId,
            character_id: data.id,
          }))
        );
    }

    await fetchCharacters();
  };

  const updateCharacter = async (id: string, character: Partial<Character>) => {
    if (!user) return;

    const updateData: any = {};
    if (character.name !== undefined) updateData.name = character.name;
    if (character.avatar !== undefined) updateData.avatar = character.avatar;
    if (character.age !== undefined) updateData.age = character.age;
    if (character.physicalDescription !== undefined) updateData.physical_description = character.physicalDescription;
    if (character.personality !== undefined) updateData.personality = character.personality;
    if (character.backstory !== undefined) updateData.backstory = character.backstory;
    if (character.role !== undefined) updateData.role = character.role;
    if (character.relationships !== undefined) updateData.relationships = character.relationships;

    const { error } = await supabase
      .from('characters')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating character:', error);
      toast.error('Erro ao atualizar personagem');
      return;
    }

    // Handle story associations if provided
    if (character.storyIds !== undefined) {
      // Delete existing associations
      await supabase
        .from('story_characters')
        .delete()
        .eq('character_id', id);

      // Insert new associations
      if (character.storyIds.length > 0) {
        await supabase
          .from('story_characters')
          .insert(
            character.storyIds.map(storyId => ({
              story_id: storyId,
              character_id: id,
            }))
          );
      }
    }

    await fetchCharacters();
  };

  const deleteCharacter = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting character:', error);
      toast.error('Erro ao deletar personagem');
      return;
    }

    await fetchCharacters();
  };

  const addNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const { error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: note.title,
        content: note.content,
        tags: note.tags,
      });

    if (error) {
      console.error('Error adding note:', error);
      toast.error('Erro ao criar nota');
      return;
    }

    await fetchNotes();
  };

  const updateNote = async (id: string, note: Partial<Note>) => {
    if (!user) return;

    const updateData: any = {};
    if (note.title !== undefined) updateData.title = note.title;
    if (note.content !== undefined) updateData.content = note.content;
    if (note.tags !== undefined) updateData.tags = note.tags;

    const { error } = await supabase
      .from('notes')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating note:', error);
      toast.error('Erro ao atualizar nota');
      return;
    }

    await fetchNotes();
  };

  const deleteNote = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      toast.error('Erro ao deletar nota');
      return;
    }

    await fetchNotes();
  };

  return (
    <AppContext.Provider value={{
      stories,
      characters,
      notes,
      loading,
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
