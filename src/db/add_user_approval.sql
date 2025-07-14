-- Add status column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update existing users to approved status (기존 사용자들은 승인 상태로 설정)
UPDATE user_profiles SET status = 'approved' WHERE status IS NULL;

-- Make status column NOT NULL
ALTER TABLE user_profiles ALTER COLUMN status SET NOT NULL;

-- Create index for faster queries
CREATE INDEX idx_user_profiles_status ON user_profiles(status);

-- Create a view for approved users only
CREATE OR REPLACE VIEW approved_users AS
SELECT * FROM user_profiles WHERE status = 'approved';
