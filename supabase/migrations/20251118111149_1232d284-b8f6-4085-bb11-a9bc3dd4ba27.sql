-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add user_type to profiles table
ALTER TABLE public.profiles 
ADD COLUMN user_type text CHECK (user_type IN ('individual', 'corporate'));

-- Create campaigns table
CREATE TABLE public.campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  target_amount numeric NOT NULL CHECK (target_amount > 0),
  current_amount numeric NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  image_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create milestones table
CREATE TABLE public.milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  target_date timestamp with time zone NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  completed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Campaigns policies
CREATE POLICY "Anyone can view active campaigns"
ON public.campaigns FOR SELECT
USING (status = 'active');

CREATE POLICY "Users can create their own campaigns"
ON public.campaigns FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
ON public.campaigns FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
ON public.campaigns FOR DELETE
USING (auth.uid() = user_id);

-- Milestones policies
CREATE POLICY "Anyone can view milestones of active campaigns"
ON public.milestones FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.campaigns
  WHERE campaigns.id = milestones.campaign_id
  AND campaigns.status = 'active'
));

CREATE POLICY "Users can create milestones for their campaigns"
ON public.milestones FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.campaigns
  WHERE campaigns.id = milestones.campaign_id
  AND campaigns.user_id = auth.uid()
));

CREATE POLICY "Users can update milestones for their campaigns"
ON public.milestones FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.campaigns
  WHERE campaigns.id = milestones.campaign_id
  AND campaigns.user_id = auth.uid()
));

CREATE POLICY "Users can delete milestones for their campaigns"
ON public.milestones FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.campaigns
  WHERE campaigns.id = milestones.campaign_id
  AND campaigns.user_id = auth.uid()
));

-- Trigger for campaigns updated_at
CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();