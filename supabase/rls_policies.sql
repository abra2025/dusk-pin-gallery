
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
WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own images
CREATE POLICY "Allow users to update their own images"
ON images
FOR UPDATE
USING (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own images
CREATE POLICY "Allow users to delete their own images"
ON images
FOR DELETE
USING (auth.uid()::text = user_id);
