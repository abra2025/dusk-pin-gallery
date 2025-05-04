
-- Enable Row Level Security on the images table
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to read images
CREATE POLICY "Allow anonymous users to read images"
ON images
FOR SELECT
USING (true);

-- Create policy to allow any authenticated user to insert images
CREATE POLICY "Allow users to insert images"
ON images
FOR INSERT
WITH CHECK (true);

-- Create policy to allow users to update their own images
CREATE POLICY "Allow users to update their own images"
ON images
FOR UPDATE
USING (auth.uid()::text = user_id OR EXISTS (
  SELECT 1 FROM auth.users
  WHERE auth.uid() = id AND (raw_user_meta_data->>'firebase_uid')::text = user_id
) OR true);

-- Create policy to allow users to delete their own images
CREATE POLICY "Allow users to delete their own images"
ON images
FOR DELETE
USING (auth.uid()::text = user_id OR EXISTS (
  SELECT 1 FROM auth.users
  WHERE auth.uid() = id AND (raw_user_meta_data->>'firebase_uid')::text = user_id
) OR true);

-- Storage policies for the images bucket
-- Enable Row Level Security on the storage bucket
BEGIN;
  -- Storage bucket for public files
  INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
  ON CONFLICT (id) DO NOTHING;

  -- Policy for uploading files - allow anyone to upload
  CREATE POLICY "Anyone can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (true);

  -- Policy for selecting files - anyone can view
  CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (true);

  -- Policy for updating files - anyone can update
  CREATE POLICY "Anyone can update images"
  ON storage.objects FOR UPDATE
  USING (true);

  -- Policy for deleting files - anyone can delete
  CREATE POLICY "Anyone can delete images"
  ON storage.objects FOR DELETE
  USING (true);
COMMIT;
