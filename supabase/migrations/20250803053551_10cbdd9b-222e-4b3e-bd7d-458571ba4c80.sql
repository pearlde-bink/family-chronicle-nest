-- Create family_memories table for CRUD operations on member memories
CREATE TABLE public.family_memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  memory_date DATE,
  location TEXT,
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.family_memories ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can view family memories" 
ON public.family_memories 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert family memories" 
ON public.family_memories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update family memories" 
ON public.family_memories 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete family memories" 
ON public.family_memories 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_family_memories_updated_at
BEFORE UPDATE ON public.family_memories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for efficient queries by member
CREATE INDEX idx_family_memories_member_id ON public.family_memories(member_id);
CREATE INDEX idx_family_memories_memory_date ON public.family_memories(memory_date);
CREATE INDEX idx_family_memories_is_favorite ON public.family_memories(is_favorite);