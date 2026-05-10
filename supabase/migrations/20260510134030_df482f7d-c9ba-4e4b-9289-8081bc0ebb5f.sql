
-- Fix profiles SELECT policy: restrict to own profile or admin
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own or admin profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- Fix order-videos bucket policies: scope to vendor folder
DROP POLICY IF EXISTS "Users can view own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own videos" ON storage.objects;

CREATE POLICY "Users can view own videos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'order-videos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'order-videos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
