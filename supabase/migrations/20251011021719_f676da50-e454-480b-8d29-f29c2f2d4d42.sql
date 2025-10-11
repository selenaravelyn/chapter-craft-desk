-- Create stories table
CREATE TABLE public.stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  genre TEXT,
  synopsis TEXT,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'completed', 'paused')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  word_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  word_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(story_id, number)
);

-- Create characters table
CREATE TABLE public.characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT,
  age TEXT,
  physical_description TEXT,
  personality TEXT,
  backstory TEXT,
  role TEXT NOT NULL DEFAULT 'other' CHECK (role IN ('protagonist', 'antagonist', 'supporting', 'other')),
  relationships TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create story_characters junction table (many-to-many relationship)
CREATE TABLE public.story_characters (
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, character_id)
);

-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stories
CREATE POLICY "Usuários podem ver suas próprias histórias"
  ON public.stories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias histórias"
  ON public.stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias histórias"
  ON public.stories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias histórias"
  ON public.stories FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for chapters
CREATE POLICY "Usuários podem ver capítulos de suas histórias"
  ON public.chapters FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.stories
    WHERE stories.id = chapters.story_id
    AND stories.user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem criar capítulos em suas histórias"
  ON public.chapters FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.stories
    WHERE stories.id = chapters.story_id
    AND stories.user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem atualizar capítulos de suas histórias"
  ON public.chapters FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.stories
    WHERE stories.id = chapters.story_id
    AND stories.user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem deletar capítulos de suas histórias"
  ON public.chapters FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.stories
    WHERE stories.id = chapters.story_id
    AND stories.user_id = auth.uid()
  ));

-- RLS Policies for characters
CREATE POLICY "Usuários podem ver seus próprios personagens"
  ON public.characters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios personagens"
  ON public.characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios personagens"
  ON public.characters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios personagens"
  ON public.characters FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for story_characters
CREATE POLICY "Usuários podem ver personagens de suas histórias"
  ON public.story_characters FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.stories
    WHERE stories.id = story_characters.story_id
    AND stories.user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem adicionar personagens às suas histórias"
  ON public.story_characters FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.stories
    WHERE stories.id = story_characters.story_id
    AND stories.user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem remover personagens de suas histórias"
  ON public.story_characters FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.stories
    WHERE stories.id = story_characters.story_id
    AND stories.user_id = auth.uid()
  ));

-- RLS Policies for notes
CREATE POLICY "Usuários podem ver suas próprias notas"
  ON public.notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias notas"
  ON public.notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias notas"
  ON public.notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias notas"
  ON public.notes FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updating updated_at on stories
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON public.stories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger for updating updated_at on chapters
CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger for updating updated_at on notes
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_stories_user_id ON public.stories(user_id);
CREATE INDEX idx_chapters_story_id ON public.chapters(story_id);
CREATE INDEX idx_characters_user_id ON public.characters(user_id);
CREATE INDEX idx_story_characters_story_id ON public.story_characters(story_id);
CREATE INDEX idx_story_characters_character_id ON public.story_characters(character_id);
CREATE INDEX idx_notes_user_id ON public.notes(user_id);