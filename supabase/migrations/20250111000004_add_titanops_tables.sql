-- TitanOps: Add all necessary tables for the complete gym management system

-- Extend businesses table with additional fields
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS hours TEXT;

-- Routines table
CREATE TABLE IF NOT EXISTS routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO')),
  duration TEXT NOT NULL,
  frequency TEXT NOT NULL,
  exercises_count INTEGER NOT NULL DEFAULT 0,
  assigned_members INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Coaches table
CREATE TABLE IF NOT EXISTS coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  photo_url TEXT,
  assigned_members INTEGER NOT NULL DEFAULT 0,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'ALTA' CHECK (status IN ('ALTA', 'BAJA')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  concept TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('Tarjeta', 'Efectivo', 'Transferencia')),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'PAGADO' CHECK (status IN ('PAGADO', 'PENDIENTE', 'ATRASADO')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'MENSUAL' CHECK (type IN ('MENSUAL', 'COHORTE')),
  members_count INTEGER NOT NULL DEFAULT 0,
  generated_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for routines
CREATE POLICY "routines_select_own_business"
  ON routines FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "routines_insert_own_business"
  ON routines FOR INSERT
  WITH CHECK (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

CREATE POLICY "routines_update_own_business"
  ON routines FOR UPDATE
  USING (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  )
  WITH CHECK (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

CREATE POLICY "routines_delete_own_business"
  ON routines FOR DELETE
  USING (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

-- RLS Policies for coaches
CREATE POLICY "coaches_select_own_business"
  ON coaches FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "coaches_insert_own_business"
  ON coaches FOR INSERT
  WITH CHECK (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

CREATE POLICY "coaches_update_own_business"
  ON coaches FOR UPDATE
  USING (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  )
  WITH CHECK (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

CREATE POLICY "coaches_delete_own_business"
  ON coaches FOR DELETE
  USING (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

-- RLS Policies for payments
CREATE POLICY "payments_select_own_business"
  ON payments FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "payments_insert_own_business"
  ON payments FOR INSERT
  WITH CHECK (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

CREATE POLICY "payments_update_own_business"
  ON payments FOR UPDATE
  USING (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  )
  WITH CHECK (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

CREATE POLICY "payments_delete_own_business"
  ON payments FOR DELETE
  USING (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

-- RLS Policies for reports
CREATE POLICY "reports_select_own_business"
  ON reports FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "reports_insert_own_business"
  ON reports FOR INSERT
  WITH CHECK (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

CREATE POLICY "reports_update_own_business"
  ON reports FOR UPDATE
  USING (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  )
  WITH CHECK (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

CREATE POLICY "reports_delete_own_business"
  ON reports FOR DELETE
  USING (
    business_id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );

-- Update businesses RLS to allow updates for gym settings
DROP POLICY IF EXISTS "businesses_update_owner" ON businesses;

CREATE POLICY "businesses_update_owner_admin"
  ON businesses FOR UPDATE
  USING (
    id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  )
  WITH CHECK (
    id = public.get_user_business_id(auth.uid())
    AND public.has_any_role(auth.uid(), ARRAY['owner', 'admin'])
  );
