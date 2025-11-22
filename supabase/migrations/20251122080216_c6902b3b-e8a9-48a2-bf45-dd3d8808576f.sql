-- Allow target_amount to be 0 for Participate campaigns
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_target_amount_check;
ALTER TABLE campaigns ADD CONSTRAINT campaigns_target_amount_check CHECK (target_amount >= 0);