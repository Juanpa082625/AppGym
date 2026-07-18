-- Create Storage bucket for routine images
INSERT INTO storage.buckets (id, name, public)
VALUES ('routine-images', 'routine-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to routine images
CREATE POLICY "Public read access for routine images"
ON storage.objects FOR SELECT
USING (bucket_id = 'routine-images');

-- Allow authenticated users to upload routine images
CREATE POLICY "Authenticated users can upload routine images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'routine-images'
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own uploads
CREATE POLICY "Users can update their own routine images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'routine-images'
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own routine images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'routine-images'
  AND auth.role() = 'authenticated'
);
