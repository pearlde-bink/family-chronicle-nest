-- Create a junction table to properly associate photos with family members
CREATE TABLE public.photo_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID NOT NULL REFERENCES public.family_photos(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(photo_id, member_id)
);

-- Enable RLS
ALTER TABLE public.photo_members ENABLE ROW LEVEL SECURITY;

-- Create policies for photo_members
CREATE POLICY "Authenticated users can view photo members" 
ON public.photo_members 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage photo members" 
ON public.photo_members 
FOR ALL 
USING (true);

-- Add indexes for better performance
CREATE INDEX idx_photo_members_photo_id ON public.photo_members(photo_id);
CREATE INDEX idx_photo_members_member_id ON public.photo_members(member_id);