-- Create the courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  icon VARCHAR(10) DEFAULT '📚',
  tags TEXT[] DEFAULT ARRAY['General'],
  video_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on tags for faster filtering
CREATE INDEX IF NOT EXISTS idx_courses_tags ON courses USING GIN (tags);

-- Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses (created_at DESC);

-- Create an index on updated_at for ordering
CREATE INDEX IF NOT EXISTS idx_courses_updated_at ON courses (updated_at DESC);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
