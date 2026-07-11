-- Fix trigger to be more robust and handle errors better

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  biz_id UUID;
  business_name TEXT;
  business_slug TEXT;
  full_name TEXT;
BEGIN
  -- Get metadata from new user
  business_name := COALESCE(NEW.raw_user_meta_data->>'business_name', 'Mi Gimnasio');
  business_slug := COALESCE(NEW.raw_user_meta_data->>'business_slug', 'gym-' || substr(NEW.id::text, 1, 8));
  full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  
  -- Create business
  INSERT INTO public.businesses (name, slug, plan, created_at, updated_at)
  VALUES (business_name, business_slug, 'free', NOW(), NOW())
  RETURNING id INTO biz_id;
  
  -- Create profile
  INSERT INTO public.profiles (id, business_id, full_name, role, created_at, updated_at)
  VALUES (NEW.id, biz_id, full_name, 'owner', NOW(), NOW());
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user trigger: %, %', SQLERRM, SQLSTATE;
    -- Still return NEW to allow user creation even if profile/business creation fails
    RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
