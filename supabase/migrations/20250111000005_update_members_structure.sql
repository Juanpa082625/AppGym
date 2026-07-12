-- Update members table to match TitanOps structure

ALTER TABLE members
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'Mensual',
ADD COLUMN IF NOT EXISTS risk_level TEXT DEFAULT 'BAJO' CHECK (risk_level IN ('ALTO', 'MEDIO', 'BAJO')),
ADD COLUMN IF NOT EXISTS coach_name TEXT;

-- Update status constraint to match TitanOps
ALTER TABLE members
DROP CONSTRAINT IF EXISTS members_status_check;

ALTER TABLE members
ADD CONSTRAINT members_status_check 
CHECK (status IN ('ACTIVO', 'EN_RIESGO', 'ATRASADO', 'PAUSADO', 'NUEVO', 'CANCELADO'));

-- Update existing members to have default values
UPDATE members 
SET 
  plan = COALESCE(plan, 'Mensual'),
  risk_level = COALESCE(risk_level, 'BAJO'),
  coach_name = COALESCE(coach_name, '—')
WHERE plan IS NULL OR risk_level IS NULL OR coach_name IS NULL;
