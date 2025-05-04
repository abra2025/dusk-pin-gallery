
-- Enable Row Level Security on the images table
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to read images
CREATE POLICY "Allow anonymous users to read images"
ON images
FOR SELECT
USING (true);

-- Create policy to allow authenticated users to insert their own images
CREATE POLICY "Allow users to insert their own images"
ON images
FOR INSERT
WITH CHECK (auth.uid()::text = user_id OR EXISTS (
  SELECT 1 FROM auth.users
  WHERE auth.uid() = id AND (raw_user_meta_data->>'firebase_uid')::text = user_id
));

-- Create policy to allow users to update their own images
CREATE POLICY "Allow users to update their own images"
ON images
FOR UPDATE
USING (auth.uid()::text = user_id OR EXISTS (
  SELECT 1 FROM auth.users
  WHERE auth.uid() = id AND (raw_user_meta_data->>'firebase_uid')::text = user_id
));

-- Create policy to allow users to delete their own images
CREATE POLICY "Allow users to delete their own images"
ON images
FOR DELETE
USING (auth.uid()::text = user_id OR EXISTS (
  SELECT 1 FROM auth.users
  WHERE auth.uid() = id AND (raw_user_meta_data->>'firebase_uid')::text = user_id
));

-- Storage policies for the images bucket
-- Enable Row Level Security on the storage bucket
BEGIN;
  -- Storage bucket for public files
  INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
  ON CONFLICT (id) DO NOTHING;

  -- Policy for uploading files
  CREATE POLICY "Anyone can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (true);

  -- Policy for selecting files
  CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (true);

  -- Policy for updating files - only file owner can update
  CREATE POLICY "Users can update their own images"
  ON storage.objects FOR UPDATE
  USING (auth.uid()::text = owner OR true);

  -- Policy for deleting files - only file owner can delete
  CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (auth.uid()::text = owner OR true);
COMMIT;
