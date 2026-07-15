-- Add fields for automatic score calculation

ALTER TABLE members
ADD COLUMN IF NOT EXISTS total_visits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS visits_this_month INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS visits_last_month INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS missed_sessions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cancelled_sessions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_workouts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_workouts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_history JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS goals_achieved INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_goals INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS weekly_frequency DECIMAL(3,2) DEFAULT 0;

-- Create function to calculate member score automatically
CREATE OR REPLACE FUNCTION calculate_member_score(member_id UUID)
RETURNS INTEGER AS $$
DECLARE
  member_record RECORD;
  score INTEGER := 100;
  days_since_last_visit INTEGER;
  attendance_rate DECIMAL(5,2);
  payment_score INTEGER := 0;
  workout_completion_rate DECIMAL(5,2);
  goal_completion_rate DECIMAL(5,2);
BEGIN
  -- Get member data
  SELECT * INTO member_record FROM members WHERE id = member_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- 1. Attendance factor (0-30 points)
  IF member_record.last_visit IS NOT NULL THEN
    days_since_last_visit := EXTRACT(DAY FROM (NOW() - member_record.last_visit));
    
    IF days_since_last_visit > 30 THEN
      score := score - 30;
    ELSIF days_since_last_visit > 14 THEN
      score := score - 20;
    ELSIF days_since_last_visit > 7 THEN
      score := score - 10;
    END IF;
  ELSE
    score := score - 15;
  END IF;
  
  -- 2. Frequency consistency (0-20 points)
  IF member_record.visits_last_month > 0 THEN
    attendance_rate := (member_record.visits_this_month::DECIMAL / member_record.visits_last_month::DECIMAL) * 100;
    
    IF attendance_rate < 50 THEN
      score := score - 20;
    ELSIF attendance_rate < 75 THEN
      score := score - 10;
    END IF;
  END IF;
  
  -- 3. Missed sessions (0-15 points)
  IF member_record.missed_sessions > 5 THEN
    score := score - 15;
  ELSIF member_record.missed_sessions > 3 THEN
    score := score - 10;
  ELSIF member_record.missed_sessions > 1 THEN
    score := score - 5;
  END IF;
  
  -- 4. Cancelled sessions (0-10 points)
  IF member_record.cancelled_sessions > 5 THEN
    score := score - 10;
  ELSIF member_record.cancelled_sessions > 2 THEN
    score := score - 5;
  END IF;
  
  -- 5. Workout completion (0-15 points)
  IF member_record.total_workouts > 0 THEN
    workout_completion_rate := (member_record.completed_workouts::DECIMAL / member_record.total_workouts::DECIMAL) * 100;
    
    IF workout_completion_rate < 50 THEN
      score := score - 15;
    ELSIF workout_completion_rate < 75 THEN
      score := score - 8;
    END IF;
  END IF;
  
  -- 6. Goal achievement (0-10 points)
  IF member_record.total_goals > 0 THEN
    goal_completion_rate := (member_record.goals_achieved::DECIMAL / member_record.total_goals::DECIMAL) * 100;
    
    IF goal_completion_rate < 30 THEN
      score := score - 10;
    ELSIF goal_completion_rate < 60 THEN
      score := score - 5;
    END IF;
  END IF;
  
  -- Ensure score is between 0 and 100
  score := GREATEST(0, LEAST(100, score));
  
  RETURN score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update score when member data changes
CREATE OR REPLACE FUNCTION update_member_score_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.risk_score := calculate_member_score(NEW.id);
  
  -- Update risk level based on score
  IF NEW.risk_score >= 70 THEN
    NEW.risk_level := 'BAJO';
  ELSIF NEW.risk_score >= 40 THEN
    NEW.risk_level := 'MEDIO';
  ELSE
    NEW.risk_level := 'ALTO';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_member_score ON members;
CREATE TRIGGER trigger_update_member_score
  BEFORE INSERT OR UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_member_score_trigger();
