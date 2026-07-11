CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  risk_score INT DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_reasons TEXT[] DEFAULT '{}',
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_visit DATE,
  monthly_fee NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dashboard_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  retention_rate NUMERIC(5,2) DEFAULT 0,
  avg_risk_score NUMERIC(5,2) DEFAULT 0,
  high_risk_count INT DEFAULT 0,
  total_members INT DEFAULT 0,
  active_members INT DEFAULT 0,
  period TEXT NOT NULL DEFAULT 'current',
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(business_id, period)
);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own_business"
  ON profiles FOR SELECT
  USING (business_id IN (
    SELECT business_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "profiles_insert"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_delete_owner"
  ON profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.business_id = profiles.business_id
        AND p.role = 'owner'
    )
  );

CREATE POLICY "businesses_select_member"
  ON businesses FOR SELECT
  USING (id IN (
    SELECT business_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "businesses_update_owner"
  ON businesses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.business_id = businesses.id
        AND profiles.role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.business_id = businesses.id
        AND profiles.role = 'owner'
    )
  );

CREATE POLICY "members_select"
  ON members FOR SELECT
  USING (business_id IN (
    SELECT business_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "members_insert"
  ON members FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT business_id FROM profiles
      WHERE id = auth.uid() AND role IN ('owner', 'admin', 'staff')
    )
  );

CREATE POLICY "members_update"
  ON members FOR UPDATE
  USING (business_id IN (
    SELECT business_id FROM profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin', 'staff')
  ))
  WITH CHECK (business_id IN (
    SELECT business_id FROM profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin', 'staff')
  ));

CREATE POLICY "members_delete"
  ON members FOR DELETE
  USING (business_id IN (
    SELECT business_id FROM profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

CREATE POLICY "dashboard_stats_select"
  ON dashboard_stats FOR SELECT
  USING (business_id IN (
    SELECT business_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "dashboard_stats_upsert"
  ON dashboard_stats FOR INSERT
  WITH CHECK (business_id IN (
    SELECT business_id FROM profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

CREATE POLICY "dashboard_stats_update"
  ON dashboard_stats FOR UPDATE
  USING (business_id IN (
    SELECT business_id FROM profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ))
  WITH CHECK (business_id IN (
    SELECT business_id FROM profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  biz_id UUID;
BEGIN
  INSERT INTO businesses (name, slug)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'Mi Gimnasio'),
    COALESCE(NEW.raw_user_meta_data->>'business_slug', 'gym-' || substr(NEW.id::text, 1, 8))
  )
  RETURNING id INTO biz_id;

  INSERT INTO profiles (id, business_id, full_name, role)
  VALUES (
    NEW.id,
    biz_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'owner'
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
