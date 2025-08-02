-- Create family members table
CREATE TABLE public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT,
  birthday DATE,
  bio TEXT,
  fun_facts TEXT[],
  avatar_url TEXT,
  relationship TEXT, -- 'parent', 'child', 'grandparent', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create photo categories table
CREATE TABLE public.photo_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create family photos table
CREATE TABLE public.family_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  taken_date DATE,
  location TEXT,
  category_id UUID REFERENCES public.photo_categories(id),
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create family events table
CREATE TABLE public.family_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_type TEXT, -- 'birthday', 'anniversary', 'trip', 'celebration', etc.
  location TEXT,
  photos TEXT[], -- array of photo URLs
  attendees UUID[], -- array of family member IDs
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- 'yearly', 'monthly', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create family posts/stories table
CREATE TABLE public.family_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.family_members(id),
  post_date DATE NOT NULL DEFAULT CURRENT_DATE,
  images TEXT[],
  tags TEXT[],
  is_milestone BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (simple authentication check since it's a shared family account)
-- Family Members policies
CREATE POLICY "Authenticated users can view family members" 
ON public.family_members FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert family members" 
ON public.family_members FOR INSERT 
TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update family members" 
ON public.family_members FOR UPDATE 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete family members" 
ON public.family_members FOR DELETE 
TO authenticated USING (true);

-- Photo Categories policies
CREATE POLICY "Authenticated users can view photo categories" 
ON public.photo_categories FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage photo categories" 
ON public.photo_categories FOR ALL 
TO authenticated USING (true);

-- Family Photos policies
CREATE POLICY "Authenticated users can view family photos" 
ON public.family_photos FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert family photos" 
ON public.family_photos FOR INSERT 
TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update family photos" 
ON public.family_photos FOR UPDATE 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete family photos" 
ON public.family_photos FOR DELETE 
TO authenticated USING (true);

-- Family Events policies
CREATE POLICY "Authenticated users can view family events" 
ON public.family_events FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage family events" 
ON public.family_events FOR ALL 
TO authenticated USING (true);

-- Family Posts policies
CREATE POLICY "Authenticated users can view family posts" 
ON public.family_posts FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage family posts" 
ON public.family_posts FOR ALL 
TO authenticated USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_photos_updated_at
  BEFORE UPDATE ON public.family_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_events_updated_at
  BEFORE UPDATE ON public.family_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_posts_updated_at
  BEFORE UPDATE ON public.family_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default photo categories
INSERT INTO public.photo_categories (name, description, color) VALUES 
('Birthdays', 'Birthday celebrations and parties', '#ef4444'),
('Holidays', 'Holiday gatherings and traditions', '#10b981'),
('Vacations', 'Family trips and adventures', '#3b82f6'),
('Milestones', 'Important life moments', '#8b5cf6'),
('Everyday Moments', 'Daily life and candid shots', '#f59e0b'),
('Anniversaries', 'Wedding anniversaries and special dates', '#ec4899');

-- Create storage bucket for family photos (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'family-photos',
  'family-photos',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for family photos
CREATE POLICY "Authenticated users can view family photos" 
ON storage.objects FOR SELECT 
TO authenticated USING (bucket_id = 'family-photos');

CREATE POLICY "Authenticated users can upload family photos" 
ON storage.objects FOR INSERT 
TO authenticated WITH CHECK (bucket_id = 'family-photos');

CREATE POLICY "Authenticated users can update family photos" 
ON storage.objects FOR UPDATE 
TO authenticated USING (bucket_id = 'family-photos');

CREATE POLICY "Authenticated users can delete family photos" 
ON storage.objects FOR DELETE 
TO authenticated USING (bucket_id = 'family-photos');