import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Save, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Type
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ChapterEditor = () => {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const { stories, addChapter, updateChapter } = useApp();
  const editorRef = useRef<HTMLDivElement>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const story = stories.find(s => s.id === storyId);
  const chapter = story?.chapters.find(c => c.id === chapterId);
  const isNew = chapterId === 'new';

  const [chapterData, setChapterData] = useState({
    title: chapter?.title || `Capítulo ${(story?.chapters.length || 0) + 1}`,
    content: chapter?.content || '',
    status: chapter?.status || 'draft' as 'draft' | 'review' | 'published',
  });

  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (editorRef.current && chapter?.content) {
      editorRef.current.innerHTML = chapter.content;
    }
  }, []);

  useEffect(() => {
    const content = editorRef.current?.innerText || '';
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [chapterData.content]);

  const handleContentChange = () => {
    const content = editorRef.current?.innerHTML || '';
    setChapterData(prev => ({ ...prev, content }));

    // Auto-save after 3 seconds of inactivity
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    const timeout = setTimeout(() => {
      handleSave(true);
    }, 3000);
    setAutoSaveTimeout(timeout);
  };

  const handleSave = (isAutoSave = false) => {
    if (!storyId) return;

    const content = editorRef.current?.innerHTML || '';
    const words = content.trim().split(/\s+/).filter(Boolean).length;

    const chapterToSave = {
      ...chapterData,
      content,
      wordCount: words,
      storyId,
      number: chapter?.number || (story?.chapters.length || 0) + 1,
    };

    if (isNew) {
      addChapter(storyId, chapterToSave);
      toast.success('Capítulo criado com sucesso!');
      navigate(`/story/${storyId}`);
    } else if (chapterId) {
      updateChapter(storyId, chapterId, chapterToSave);
      setLastSaved(new Date());
      if (!isAutoSave) {
        toast.success('Capítulo salvo!');
      }
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  if (!story) {
    return <div>História não encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/story/${storyId}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <Input
                value={chapterData.title}
                onChange={(e) => setChapterData({ ...chapterData, title: e.target.value })}
                className="text-lg font-semibold border-none bg-transparent"
                placeholder="Título do capítulo"
              />
              <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                <span>{wordCount} palavras</span>
                {lastSaved && (
                  <span>Salvo às {lastSaved.toLocaleTimeString()}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Select
              value={chapterData.status}
              onValueChange={(value: any) => setChapterData({ ...chapterData, status: value })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="review">Revisão</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleSave()}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-t border-border p-2 flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('bold')}
            title="Negrito (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('italic')}
            title="Itálico (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('underline')}
            title="Sublinhado (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('formatBlock', 'h1')}
            title="Título 1"
          >
            <Type className="w-4 h-4" />
            <span className="ml-1 text-xs">H1</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('formatBlock', 'h2')}
            title="Título 2"
          >
            <Type className="w-4 h-4" />
            <span className="ml-1 text-xs">H2</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('formatBlock', 'h3')}
            title="Título 3"
          >
            <Type className="w-4 h-4" />
            <span className="ml-1 text-xs">H3</span>
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyLeft')}
            title="Alinhar à esquerda"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyCenter')}
            title="Centralizar"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyRight')}
            title="Alinhar à direita"
          >
            <AlignRight className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('insertUnorderedList')}
            title="Lista"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('insertOrderedList')}
            title="Lista numerada"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('undo')}
            title="Desfazer (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('redo')}
            title="Refazer (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            className={cn(
              "min-h-[600px] outline-none font-editor text-lg leading-relaxed",
              "prose prose-lg dark:prose-invert max-w-none",
              "focus:outline-none"
            )}
            style={{ whiteSpace: 'pre-wrap' }}
            data-placeholder="Comece a escrever sua história..."
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterEditor;
