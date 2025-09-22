import type { Course } from "@/types/course"
import { createClient } from "@/lib/supabase/server"

export const sampleCourses: Course[] = [
  {
    id: "1",
    title: "15 AI SEO Super-prompts",
    description: "Comprehensive collection of AI-powered SEO prompts to boost your search rankings",
    content:
      "# 15 AI SEO Super-prompts\n\n## Overview\nThis collection contains 15 powerful AI prompts specifically designed for SEO optimization.\n\n## Prompts Include:\n- Keyword research automation\n- Content optimization strategies\n- Meta description generation\n- Schema markup creation\n- And much more!\n\n## How to Use\nEach prompt is designed to be used with ChatGPT, Claude, or other AI assistants to streamline your SEO workflow.",
    icon: "📊",
    tags: ["SEO", "AI", "Marketing", "Prompts"],
    category: "SEO",
    videoUrl: "",
  },
  {
    id: "2",
    title: "The system to charge $500 for 4 hours of work",
    description: "Learn the exact framework to command premium rates for your services",
    content:
      "# The $500/4-Hour System\n\n## Introduction\nDiscover how to position yourself as a premium service provider and charge what you're truly worth.\n\n## Key Components:\n1. **Value-Based Pricing** - Price on outcomes, not time\n2. **Premium Positioning** - How to present yourself as the expert\n3. **Client Psychology** - Understanding what drives high-value clients\n4. **Delivery Framework** - Maximizing efficiency while maintaining quality\n\n## Implementation Steps:\n- Audit your current pricing model\n- Identify your unique value proposition\n- Create premium service packages\n- Master the sales conversation",
    icon: "💰",
    tags: ["Business", "Pricing", "Freelancing", "Strategy"],
    category: "Business",
    videoUrl: "",
  },
  {
    id: "3",
    title: "Building an n8n agency",
    description: "Complete guide to starting and scaling an automation agency using n8n",
    content:
      "# Building an n8n Agency\n\n## What is n8n?\nn8n is a powerful workflow automation tool that allows you to connect different services and automate business processes.\n\n## Agency Model:\n- **Service Offerings**: What automations to offer clients\n- **Pricing Structure**: How to price automation projects\n- **Client Acquisition**: Finding businesses that need automation\n- **Delivery Process**: From consultation to implementation\n\n## Technical Setup:\n- n8n installation and configuration\n- Common workflow templates\n- Client onboarding process\n- Maintenance and support strategies",
    icon: "🔧",
    tags: ["Automation", "n8n", "Agency", "Business"],
    category: "Automation",
    videoUrl: "",
  },
  {
    id: "4",
    title: "The automated Fiverr blueprint to make $3k/month",
    description: "Step-by-step system to automate your Fiverr business and scale to $3k monthly",
    content:
      "# Automated Fiverr Blueprint\n\n## The Strategy\nLearn how to create a semi-automated Fiverr business that generates consistent monthly revenue.\n\n## Core Components:\n1. **Niche Selection** - Finding profitable, automatable services\n2. **Gig Optimization** - Creating gigs that sell themselves\n3. **Automation Tools** - Software and systems to reduce manual work\n4. **Scaling Framework** - Growing from $500 to $3000+ per month\n\n## Automation Areas:\n- Customer communication templates\n- Delivery process automation\n- Quality control systems\n- Upselling sequences",
    icon: "🚀",
    tags: ["Fiverr", "Automation", "Freelancing", "Income"],
    category: "Fiverr",
    videoUrl: "",
  },
  {
    id: "5",
    title: "+1,000 Perfect Copy Swipe File",
    description: "Massive collection of high-converting copy examples across all industries",
    content:
      "# +1,000 Perfect Copy Swipe File\n\n## What's Included:\nOver 1,000 examples of high-converting copy across multiple formats and industries.\n\n## Categories:\n- **Email Subject Lines** - 200+ proven openers\n- **Sales Pages** - Complete page breakdowns\n- **Ad Copy** - Facebook, Google, LinkedIn examples\n- **Email Sequences** - Welcome, nurture, and sales sequences\n- **Headlines** - Attention-grabbing headlines that convert\n\n## How to Use:\n- Study the patterns and formulas\n- Adapt examples to your industry\n- Test variations for your audience\n- Build your own swipe file library",
    icon: "📝",
    tags: ["Copywriting", "Marketing", "Sales", "Templates"],
    category: "Copywriting",
    videoUrl: "",
  },
  {
    id: "6",
    title: "The blueprint to run an automated business",
    description: "Complete framework for building and running a fully automated business",
    content:
      "# Automated Business Blueprint\n\n## Vision\nBuild a business that runs without your constant involvement while maintaining quality and growth.\n\n## The Framework:\n1. **Business Model Selection** - Choosing automation-friendly models\n2. **System Architecture** - Building interconnected automated systems\n3. **Team Structure** - When and how to hire for automation\n4. **Technology Stack** - Essential tools and platforms\n\n## Key Areas:\n- Marketing automation\n- Sales process automation\n- Customer service automation\n- Financial management automation\n- Performance monitoring and optimization",
    icon: "⚙️",
    tags: ["Automation", "Business", "Systems", "Passive Income"],
    category: "Automation",
    videoUrl: "",
  },
  {
    id: "7",
    title: "Prompts to learn n8n",
    description: "AI prompts specifically designed to accelerate your n8n learning journey",
    content:
      '# n8n Learning Prompts\n\n## Learning Approach\nUse these AI prompts to master n8n workflow automation faster than traditional methods.\n\n## Prompt Categories:\n- **Beginner Concepts** - Understanding nodes and workflows\n- **Intermediate Techniques** - Complex logic and data manipulation\n- **Advanced Patterns** - Error handling and optimization\n- **Real-World Scenarios** - Practical business automation examples\n\n## Sample Prompts:\n"Explain how to connect Google Sheets to Slack using n8n with error handling"\n"Create an n8n workflow that monitors website uptime and sends alerts"\n"Show me how to process webhook data and update a CRM in n8n"',
    icon: "🤖",
    tags: ["n8n", "Learning", "AI Prompts", "Automation"],
    category: "n8n",
    videoUrl: "",
  },
  {
    id: "8",
    title: "How to find clients on X using AI",
    description: "Leverage AI tools to identify and connect with potential clients on X (Twitter)",
    content:
      "# Finding Clients on X with AI\n\n## Strategy Overview\nUse AI-powered tools and techniques to identify, engage, and convert prospects on X into paying clients.\n\n## AI Tools & Techniques:\n1. **Prospect Identification** - AI tools to find ideal clients\n2. **Content Analysis** - Understanding what resonates with your audience\n3. **Engagement Automation** - Smart, personalized outreach\n4. **Conversation Starters** - AI-generated opening messages\n\n## Implementation:\n- Set up monitoring for relevant keywords\n- Create AI-powered content calendars\n- Automate initial outreach (while staying personal)\n- Track and optimize conversion rates",
    icon: "🐦",
    tags: ["X", "Twitter", "AI", "Client Acquisition", "Social Media"],
    category: "X",
    videoUrl: "",
  },
  {
    id: "9",
    title: "100+ super-prompts pack",
    description: "Comprehensive collection of AI prompts for various business and creative tasks",
    content:
      "# 100+ Super-Prompts Pack\n\n## What You Get:\nA curated collection of over 100 high-quality AI prompts for different use cases.\n\n## Categories Include:\n- **Content Creation** - Blog posts, social media, newsletters\n- **Business Strategy** - Planning, analysis, decision-making\n- **Marketing** - Campaigns, copy, audience research\n- **Productivity** - Task management, planning, optimization\n- **Creative Projects** - Design briefs, brainstorming, ideation\n\n## Bonus Features:\n- Prompt customization guide\n- Industry-specific variations\n- Advanced prompt engineering techniques\n- Regular updates with new prompts",
    icon: "💡",
    tags: ["AI Prompts", "Productivity", "Business", "Creativity"],
    category: "AI Prompts",
    videoUrl: "",
  },
  {
    id: "10",
    title: "10 AI Content creation prompts for social media",
    description: "Specialized prompts for creating engaging social media content using AI",
    content:
      "# 10 AI Content Creation Prompts\n\n## Social Media Focus\nThese prompts are specifically crafted for creating engaging social media content across platforms.\n\n## The 10 Prompts:\n1. **Viral Hook Generator** - Create attention-grabbing opening lines\n2. **Story Transformer** - Turn boring topics into engaging stories\n3. **Trend Analyzer** - Identify and capitalize on trending topics\n4. **Engagement Booster** - Create posts that drive comments and shares\n5. **Platform Optimizer** - Adapt content for different social platforms\n\n## Additional Prompts:\n6. Visual content descriptions\n7. Hashtag research and optimization\n8. Community engagement responses\n9. Crisis communication templates\n10. Influencer collaboration outreach",
    icon: "📱",
    tags: ["Social Media", "AI", "Content Creation", "Marketing"],
    category: "Social Media",
    videoUrl: "",
  },
  {
    id: "11",
    title: "How to go from zero to $10k/month with AI",
    description: "Complete roadmap to building a $10k/month income stream using AI tools and strategies",
    content:
      "# Zero to $10k/Month with AI\n\n## The Roadmap\nA step-by-step guide to building a sustainable $10k monthly income using AI tools and strategies.\n\n## Phase 1: Foundation (Month 1-2)\n- Skill assessment and gap analysis\n- AI tool mastery (ChatGPT, Claude, etc.)\n- Niche selection and market research\n- Basic service offering development\n\n## Phase 2: Launch (Month 3-4)\n- Client acquisition strategies\n- Service delivery optimization\n- Pricing and positioning\n- Building initial case studies\n\n## Phase 3: Scale (Month 5-6)\n- Automation implementation\n- Team building and delegation\n- Premium service development\n- Multiple income stream creation",
    icon: "📈",
    tags: ["AI", "Income", "Business Growth", "Strategy"],
    category: "AI",
    videoUrl: "",
  },
  {
    id: "12",
    title: "How to copy + paste any SaaS for $10k/month",
    description: "Ethical framework for analyzing successful SaaS models and creating your own version",
    content:
      "# SaaS Replication Framework\n\n## Ethical Approach\nLearn how to analyze successful SaaS businesses and create your own unique version in underserved markets.\n\n## The Process:\n1. **Market Analysis** - Identifying successful SaaS models\n2. **Gap Identification** - Finding underserved niches or improvements\n3. **Feature Mapping** - Understanding core vs. nice-to-have features\n4. **Differentiation Strategy** - Making your version unique and better\n\n## Implementation:\n- Technical requirements and MVP development\n- Go-to-market strategy\n- Pricing and positioning\n- Customer acquisition and retention\n- Scaling to $10k MRR and beyond",
    icon: "💻",
    tags: ["SaaS", "Business Model", "Software", "Revenue"],
    category: "SaaS",
    videoUrl: "",
  },
]

export async function checkDatabaseConnection() {
  const supabase = await createClient()

  try {
    console.log("[v0] Checking database connection...")
    const { count, error } = await supabase.from("courses").select("*", { count: "exact", head: true })

    if (error) {
      console.log("[v0] Database error, falling back to mock data:", error.message)
      return { connected: false, error: error.message }
    }

    console.log("[v0] Database connected successfully")
    return { connected: true, count: count || 0 }
  } catch (error) {
    console.log("[v0] Database connection failed - using mock data")
    return { connected: false, error }
  }
}

export async function loadCoursesFromDatabase() {
  const supabase = await createClient()

  try {
    console.log("[v0] Loading courses from database...")
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("updated_at", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.log("[v0] Database error, falling back to mock data:", error.message)
      return { courses: sampleCourses, fromDatabase: false }
    }

    if (!data || data.length === 0) {
      console.log("[v0] No courses found in database, using mock data")
      return { courses: sampleCourses, fromDatabase: false }
    }

    console.log(`[v0] Loaded ${data.length} courses from database`)
    return { courses: data, fromDatabase: true }
  } catch (error) {
    console.log("[v0] Error loading courses:", error)
    return { courses: sampleCourses, fromDatabase: false }
  }
}
