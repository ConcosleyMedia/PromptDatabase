-- Sample prompts data for testing the application
-- Run this after your main schema is set up

-- Insert sample text prompts
INSERT INTO public.prompts (title, content, description, type, category, tags, platform, created_by) VALUES
(
  'Expert Code Reviewer',
  'You are an expert software engineer with 10+ years of experience. Review the following code and provide detailed feedback on:

  1. Code quality and best practices
  2. Potential bugs or security issues
  3. Performance optimizations
  4. Readability and maintainability
  5. Specific improvements with examples

  Please be constructive and provide actionable suggestions.',
  'A comprehensive code review prompt that covers quality, security, and performance',
  'text',
  'coding',
  ARRAY['code-review', 'software-engineering', 'debugging', 'best-practices'],
  'chatgpt',
  NULL
),
(
  'Marketing Copy Generator',
  'You are a professional copywriter specializing in conversion-focused marketing copy. Create compelling marketing copy for [PRODUCT/SERVICE] that:

  - Identifies the target audience pain points
  - Highlights unique value propositions
  - Uses persuasive language and emotional triggers
  - Includes a strong call-to-action
  - Maintains brand voice: [BRAND_VOICE]

  Format: Write 3 variations with different angles (problem-focused, benefit-focused, story-driven)',
  'Generate high-converting marketing copy with multiple angles',
  'text',
  'marketing',
  ARRAY['copywriting', 'conversion', 'sales', 'advertising'],
  'claude',
  NULL
),
(
  'UI/UX Design Critic',
  'You are a senior UX designer with expertise in human-centered design. Analyze the following design and provide feedback on:

  **Usability:**
  - Information architecture and navigation
  - User flow and task completion
  - Accessibility compliance

  **Visual Design:**
  - Typography and hierarchy
  - Color usage and contrast
  - Spacing and layout consistency

  **Mobile Responsiveness:**
  - Touch target sizes
  - Content adaptation
  - Performance considerations

  Provide specific, actionable recommendations for improvement.',
  'Professional UX design analysis and recommendations',
  'text',
  'design',
  ARRAY['ux', 'ui', 'design-review', 'usability', 'accessibility'],
  'gpt-4',
  NULL
),
(
  'Business Strategy Consultant',
  'You are a McKinsey-level business strategy consultant. Analyze the business situation and provide strategic recommendations:

  **Market Analysis:**
  - Industry trends and competitive landscape
  - Market size and growth opportunities
  - Customer segments and personas

  **Strategic Options:**
  - Growth strategies (organic vs. acquisition)
  - Market entry/expansion approaches
  - Product/service portfolio optimization

  **Implementation:**
  - Priority initiatives and timeline
  - Resource requirements and ROI projections
  - Risk assessment and mitigation strategies

  Present findings in executive summary format with clear recommendations.',
  'High-level business strategy analysis and recommendations',
  'text',
  'business',
  ARRAY['strategy', 'consulting', 'analysis', 'planning'],
  'claude',
  NULL
),
(
  'Technical Writer Pro',
  'You are a technical writing specialist who creates clear, comprehensive documentation. Transform complex technical information into user-friendly content:

  **Documentation Types:**
  - API documentation with examples
  - User guides and tutorials
  - Installation and setup instructions
  - Troubleshooting guides

  **Writing Standards:**
  - Clear, concise language
  - Logical information hierarchy
  - Step-by-step instructions
  - Code examples and screenshots
  - SEO-optimized headings

  Focus on user experience and ease of understanding.',
  'Professional technical documentation and user guides',
  'text',
  'writing',
  ARRAY['technical-writing', 'documentation', 'tutorials', 'api-docs'],
  'gpt-4',
  NULL
);

-- Insert sample image prompts
INSERT INTO public.prompts (title, content, description, type, category, tags, platform, style, image_url, created_by) VALUES
(
  'Cyberpunk Portrait Masterpiece',
  'Portrait of a futuristic cyberpunk character, neon-lit city backdrop, chrome implants, glowing eyes, leather jacket with LED details, rain-soaked streets, holographic advertisements, dramatic lighting, photorealistic, 8K resolution, cinematic composition --ar 2:3 --v 6',
  'Detailed cyberpunk character portrait with neon aesthetics',
  'image',
  'art',
  ARRAY['cyberpunk', 'portrait', 'neon', 'futuristic', 'character-design'],
  'midjourney',
  'cyberpunk',
  'https://example.com/cyberpunk-portrait.jpg',
  NULL
),
(
  'Minimalist Product Photography',
  'Clean product photography of [PRODUCT], white background, soft natural lighting, minimal shadows, professional studio setup, commercial quality, sharp focus, elegant composition, negative space, 35mm lens perspective --ar 1:1 --style raw',
  'Professional product photography with minimalist aesthetic',
  'image',
  'marketing',
  ARRAY['product-photography', 'minimalist', 'commercial', 'clean'],
  'midjourney',
  'minimalist',
  'https://example.com/product-photo.jpg',
  NULL
),
(
  'Fantasy Landscape Epic',
  'Breathtaking fantasy landscape, floating islands connected by waterfalls, ancient magical ruins, ethereal mist, dramatic sunset sky with multiple moons, mystical creatures in the distance, enchanted forest, crystal formations, magical lighting effects, concept art style, highly detailed --ar 16:9 --v 6',
  'Epic fantasy landscape with magical elements',
  'image',
  'art',
  ARRAY['fantasy', 'landscape', 'magical', 'concept-art', 'epic'],
  'midjourney',
  'fantasy',
  'https://example.com/fantasy-landscape.jpg',
  NULL
),
(
  'Modern Architecture Visualization',
  'Ultra-modern architectural visualization, glass and steel structure, sustainable design elements, green roof garden, floor-to-ceiling windows, natural lighting, minimalist interior visible, urban context, professional architectural rendering, high contrast, clean lines --ar 16:9 --style raw',
  'Contemporary architectural visualization with sustainable design',
  'image',
  'design',
  ARRAY['architecture', 'modern', 'sustainable', 'visualization', 'rendering'],
  'midjourney',
  'architectural',
  'https://example.com/modern-architecture.jpg',
  NULL
),
(
  'Retro Gaming Pixel Art',
  'Retro 16-bit pixel art character, action platformer hero, vibrant color palette, detailed sprite animation style, side-scrolling game aesthetic, power-up effects, classic gaming nostalgia, sharp pixels, no anti-aliasing, authentic retro gaming feel --ar 1:1',
  '16-bit retro gaming character in classic pixel art style',
  'image',
  'art',
  ARRAY['pixel-art', 'retro', 'gaming', '16-bit', 'sprite'],
  'midjourney',
  'pixel-art',
  'https://example.com/pixel-character.jpg',
  NULL
);

-- Update some prompt view counts and vote counts for variety
UPDATE public.prompts SET
  view_count = FLOOR(RANDOM() * 1000) + 50,
  vote_count = FLOOR(RANDOM() * 100) + 5,
  save_count = FLOOR(RANDOM() * 50) + 2
WHERE id IN (SELECT id FROM public.prompts LIMIT 10);

-- Insert some additional prompts for pagination testing
INSERT INTO public.prompts (title, content, description, type, category, tags, platform, created_by) VALUES
(
  'Data Analysis Expert',
  'You are a senior data analyst with expertise in statistical analysis and data visualization. Analyze the provided dataset and deliver insights:

  **Data Exploration:**
  - Summary statistics and distributions
  - Data quality assessment
  - Correlation analysis
  - Outlier detection

  **Insights Generation:**
  - Key trends and patterns
  - Actionable business insights
  - Recommendations based on findings
  - Statistical significance testing

  **Visualization:**
  - Suggest appropriate chart types
  - Dashboard layout recommendations
  - Key metrics to highlight

  Present findings in executive-friendly format.',
  'Comprehensive data analysis and insights generation',
  'text',
  'data',
  ARRAY['data-analysis', 'statistics', 'insights', 'visualization'],
  'claude',
  NULL
),
(
  'Email Marketing Specialist',
  'You are an email marketing expert focused on high-converting campaigns. Create email content that drives engagement:

  **Email Components:**
  - Compelling subject lines (A/B test variations)
  - Personalized opening hooks
  - Value-driven body content
  - Clear call-to-action buttons
  - Mobile-optimized formatting

  **Strategy Elements:**
  - Segmentation recommendations
  - Send time optimization
  - Follow-up sequence planning
  - Performance metrics to track

  Focus on increasing open rates, click-through rates, and conversions.',
  'High-converting email marketing campaigns and strategy',
  'text',
  'marketing',
  ARRAY['email-marketing', 'conversion', 'automation', 'campaigns'],
  'gpt-4',
  NULL
),
(
  'Watercolor Botanical Art',
  'Delicate watercolor painting of exotic botanical specimens, soft color washes, natural paper texture, scientific illustration style, detailed plant anatomy, gentle color gradients, organic flowing forms, traditional watercolor techniques, botanical accuracy, vintage field guide aesthetic --ar 3:4 --style raw',
  'Scientific botanical illustration in traditional watercolor style',
  'image',
  'art',
  ARRAY['watercolor', 'botanical', 'scientific', 'traditional', 'nature'],
  'midjourney',
  'watercolor',
  'https://example.com/botanical-watercolor.jpg',
  NULL
),
(
  'Startup Pitch Deck Designer',
  'You are a startup advisor specializing in investor presentations. Create a compelling pitch deck structure:

  **Core Slides:**
  1. Problem & Solution (emotional hook)
  2. Market Opportunity (TAM/SAM/SOM)
  3. Product Demo (key features)
  4. Business Model (revenue streams)
  5. Traction (growth metrics)
  6. Competition (differentiation)
  7. Team (credibility)
  8. Financial Projections (3-year)
  9. Funding Ask (use of funds)
  10. Next Milestones

  **Design Principles:**
  - One key message per slide
  - Visual storytelling with data
  - Consistent branding
  - Investor-focused narrative

  Provide slide-by-slide content recommendations.',
  'Professional startup pitch deck structure and content',
  'text',
  'business',
  ARRAY['startup', 'pitch-deck', 'investor', 'presentation'],
  'claude',
  NULL
),
(
  'Abstract Digital Art',
  'Flowing abstract digital art composition, vibrant color gradients, geometric patterns merging with organic forms, particle effects, dynamic energy flow, iridescent surfaces, fractal elements, modern digital aesthetic, high contrast, crystalline structures --ar 16:9 --style raw',
  'Dynamic abstract digital art with geometric and organic elements',
  'image',
  'art',
  ARRAY['abstract', 'digital', 'geometric', 'vibrant', 'modern'],
  'dalle',
  'abstract',
  'https://example.com/abstract-digital.jpg',
  NULL
);

-- Add a few more for good measure
INSERT INTO public.prompts (title, content, description, type, category, tags, platform, created_by)
SELECT
  'Sample Prompt ' || generate_series,
  'This is sample prompt content number ' || generate_series || '. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Sample description for prompt ' || generate_series,
  CASE WHEN random() < 0.7 THEN 'text' ELSE 'image' END,
  (ARRAY['coding', 'marketing', 'writing', 'design', 'business', 'education', 'art', 'productivity', 'data', 'other'])[floor(random() * 10 + 1)],
  ARRAY['sample', 'test', 'demo'],
  (ARRAY['chatgpt', 'claude', 'gpt-4', 'midjourney', 'dalle'])[floor(random() * 5 + 1)],
  NULL
FROM generate_series(1, 15);

-- Update view counts, vote counts, and save counts for all prompts
UPDATE public.prompts SET
  view_count = FLOOR(RANDOM() * 500) + 10,
  vote_count = FLOOR(RANDOM() * 50) + 1,
  save_count = FLOOR(RANDOM() * 25) + 1;

-- Insert a sample admin user (you'll need to update this with actual user ID after authentication)
-- This is just a placeholder - you'll set the actual admin flag via Supabase dashboard
-- after your first login with Whop

COMMIT;