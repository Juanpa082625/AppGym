-- Fix infinite recursion in RLS policies

-- Drop problematic policies
DROP POLICY IF EXISTS "profiles_select_own_business" ON profiles;
DROP POLICY IF EXISTS "businesses_select_member" ON businesses;
DROP POLICY IF EXISTS "members_select" ON members;
DROP POLICY IF EXISTS "members_insert" ON members;
DROP POLICY IF EXISTS "members_update" ON members;
DROP POLICY IF EXISTS "members_delete" ON members;
DROP POLICY IF EXISTS "dashboard_stats_select" ON dashboard_stats;
DROP POLICY IF EXISTS "dashboard_stats_upsert" ON dashboard_stats;
DROP POLICY IF EXISTS "dashboard_stats_update" ON dashboard_stats;

-- Create helper function to get user's business_id without RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_business_id(user_id uuid)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT business_id FROM public.profiles WHERE id = user_id LIMIT 1;
$$;

-- Create helper function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = required_role
  );
$$;

-- Create helper function to check if user has any of the specified roles
CREATE OR REPLACE FUNCTION public.has_any_role(user_id uuid, required_roles text[])
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = ANY(required_roles)
  );
$$;

-- Recreate policies without recursion

-- PROFILES: Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- PROFILES: Users can read profiles from their business (for team features)
CREATE POLICY "profiles_select_business"
  ON profiles FOR SELECT
  USING (
    business_id = public.get_user_business_id(auth.uid())
    AND id != auth.uid()
  );

-- BUSINESSES: Users can read their own business
CREATE POLICY "businesses_select_member"
  ON businesses FOR SELECT
  USING (id = public.get_user_business_id(auth.uid()));

-- MEMBERS: Select
CREATE POLICY "members_select"
  ON members FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

-- MEMBERS: Insert (owner, admin, staff)
CREATE POLICY "members_insert"
  ON members FOR INSERT
  WITH CHECK (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin', 'staff'])
  );

-- MEMBERS: Update (owner, admin, staff)
CREATE POLICY "members_update"
  ON members FOR UPDATE
  USING (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin', 'staff'])
  )
  WITH CHECK (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin', 'staff'])
  );

-- MEMBERS: Delete (owner, admin only)
CREATE POLICY "members_delete"
  ON members FOR DELETE
  USING (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

-- DASHBOARD_STATS: Select
CREATE POLICY "dashboard_stats_select"
  ON dashboard_stats FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

-- DASHBOARD_STATS: Insert (owner, admin)
CREATE POLICY "dashboard_stats_upsert"
  ON dashboard_stats FOR INSERT
  WITH CHECK (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

-- DASHBOARD_STATS: Update (owner, admin)
CREATE POLICY "dashboard_stats_update"
  ON dashboard_stats FOR UPDATE
  USING (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  )
  WITH CHECK (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );
