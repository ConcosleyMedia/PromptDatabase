-- Seed the courses table with sample data
-- Run this to populate your courses database with sample content

INSERT INTO public.courses (
  id,
  title,
  description,
  content,
  icon,
  tags,
  video_url,
  thumbnail_url,
  created_at,
  updated_at
) VALUES
(
  gen_random_uuid(),
  'Introduction to React',
  'Learn the fundamentals of React including components, props, and state management.',
  'This comprehensive course covers React basics from the ground up. You''ll learn about JSX, components, props, state, and event handling. Perfect for beginners who want to start building modern web applications.',
  '⚛️',
  ARRAY['react', 'javascript', 'frontend', 'beginner'],
  'https://www.youtube.com/watch?v=SqcY0GlETPk',
  '/placeholder.svg?height=200&width=300',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Advanced TypeScript',
  'Master advanced TypeScript concepts including generics, decorators, and type manipulation.',
  'Dive deep into TypeScript''s advanced features. Learn about generic types, conditional types, mapped types, decorators, and advanced patterns. This course is designed for developers who already know TypeScript basics.',
  '🔷',
  ARRAY['typescript', 'javascript', 'advanced', 'types'],
  'https://www.youtube.com/watch?v=30LWjhZzg50',
  '/placeholder.svg?height=200&width=300',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Node.js Backend Development',
  'Build scalable backend applications with Node.js, Express, and MongoDB.',
  'Learn to build robust backend APIs using Node.js and Express. Cover authentication, database integration with MongoDB, middleware, error handling, and deployment strategies.',
  '🟢',
  ARRAY['nodejs', 'backend', 'express', 'mongodb', 'api'],
  'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
  '/placeholder.svg?height=200&width=300',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'CSS Grid & Flexbox Mastery',
  'Master modern CSS layout techniques with Grid and Flexbox.',
  'Become proficient in CSS Grid and Flexbox. Learn when to use each layout method, create responsive designs, and build complex layouts with ease. Includes practical projects and real-world examples.',
  '🎨',
  ARRAY['css', 'layout', 'grid', 'flexbox', 'responsive'],
  'https://www.youtube.com/watch?v=jV8B24rSN5o',
  '/placeholder.svg?height=200&width=300',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Python Data Science',
  'Analyze data and build machine learning models with Python, pandas, and scikit-learn.',
  'Complete data science workflow using Python. Learn pandas for data manipulation, matplotlib for visualization, and scikit-learn for machine learning. Includes real datasets and practical projects.',
  '🐍',
  ARRAY['python', 'data-science', 'pandas', 'machine-learning', 'analytics'],
  'https://www.youtube.com/watch?v=ua-CiDNNj30',
  '/placeholder.svg?height=200&width=300',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Docker & Kubernetes',
  'Containerize applications and orchestrate them with Docker and Kubernetes.',
  'Learn containerization with Docker and orchestration with Kubernetes. Cover Docker basics, creating images, container networking, Kubernetes pods, services, and deployments.',
  '🐳',
  ARRAY['docker', 'kubernetes', 'devops', 'containers', 'deployment'],
  'https://www.youtube.com/watch?v=3c-iBn73dDE',
  '/placeholder.svg?height=200&width=300',
  NOW(),
  NOW()
);

-- Update the created_at and updated_at timestamps to have some variation
UPDATE public.courses SET 
  created_at = created_at - (RANDOM() * INTERVAL '30 days'),
  updated_at = updated_at - (RANDOM() * INTERVAL '7 days');

COMMIT;
