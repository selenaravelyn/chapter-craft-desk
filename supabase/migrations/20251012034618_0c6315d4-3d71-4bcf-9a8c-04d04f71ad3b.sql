-- Create storage bucket for story covers
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'story-covers',
  'story-covers',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policies for story covers
CREATE POLICY "Usuários podem fazer upload de capas de suas histórias"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'story-covers' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Capas são visíveis publicamente"
ON storage.objects
FOR SELECT
USING (bucket_id = 'story-covers');

CREATE POLICY "Usuários podem atualizar capas de suas histórias"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'story-covers' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Usuários podem deletar capas de suas histórias"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'story-covers' AND
  auth.uid()::text = (storage.foldername(name))[1]
);