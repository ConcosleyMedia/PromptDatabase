-- Create courses table for storing course data
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📚',
  tags TEXT[] DEFAULT '{}',
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public course database)
-- Allow anyone to view courses
CREATE POLICY "courses_select_all" ON public.courses FOR SELECT USING (true);

-- For now, allow anyone to insert/update/delete courses
-- In production, you might want to restrict this to authenticated users
CREATE POLICY "courses_insert_all" ON public.courses FOR INSERT WITH CHECK (true);
CREATE POLICY "courses_update_all" ON public.courses FOR UPDATE USING (true);
CREATE POLICY "courses_delete_all" ON public.courses FOR DELETE USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON public.courses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
