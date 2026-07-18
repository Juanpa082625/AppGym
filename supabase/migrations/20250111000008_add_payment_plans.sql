-- Add payment plan fields to members table

ALTER TABLE members
ADD COLUMN IF NOT EXISTS plan_start_date DATE,
ADD COLUMN IF NOT EXISTS plan_end_date DATE,
ADD COLUMN IF NOT EXISTS plan_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS plan_payment_method TEXT CHECK (plan_payment_method IN ('Tarjeta', 'Efectivo', 'Transferencia', 'Otro'));

-- Create function to calculate membership status
CREATE OR REPLACE FUNCTION calculate_membership_status(plan_end_date DATE)
RETURNS TEXT AS $$
DECLARE
  days_until_expiry INTEGER;
BEGIN
  IF plan_end_date IS NULL THEN
    RETURN 'SIN_PLAN';
  END IF;
  
  days_until_expiry := plan_end_date - CURRENT_DATE;
  
  IF days_until_expiry < 0 THEN
    RETURN 'VENCIDA';
  ELSIF days_until_expiry = 0 THEN
    RETURN 'VENCE_HOY';
  ELSIF days_until_expiry <= 7 THEN
    RETURN 'PROXIMA_A_VENCER';
  ELSE
    RETURN 'ACTIVA';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create view to show members with calculated membership status
CREATE OR REPLACE VIEW members_with_status AS
SELECT 
  *,
  calculate_membership_status(plan_end_date) as membership_status,
  CASE 
    WHEN plan_end_date IS NOT NULL THEN plan_end_date - CURRENT_DATE
    ELSE NULL
  END as days_until_expiry
FROM members;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_members_plan_end_date ON members(plan_end_date);
