-- Add thumbnail_url column to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Add some sample thumbnail URLs to existing courses
UPDATE courses SET thumbnail_url = '/placeholder.svg?height=200&width=300' WHERE title ILIKE '%database%';
UPDATE courses SET thumbnail_url = '/placeholder.svg?height=200&width=300' WHERE title ILIKE '%api%';
UPDATE courses SET thumbnail_url = '/placeholder.svg?height=200&width=300' WHERE title ILIKE '%react%';
UPDATE courses SET thumbnail_url = '/placeholder.svg?height=200&width=300' WHERE title ILIKE '%javascript%';
UPDATE courses SET thumbnail_url = '/placeholder.svg?height=200&width=300' WHERE thumbnail_url IS NULL;
