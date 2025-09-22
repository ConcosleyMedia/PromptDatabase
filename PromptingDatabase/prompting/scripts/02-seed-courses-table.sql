-- Seed the courses table with sample data
INSERT INTO courses (id, title, description, content, icon, tags, video_url, thumbnail_url, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  '15 AI SEO Super-prompts',
  'Comprehensive collection of AI-powered SEO prompts to boost your search rankings',
  '# 15 AI SEO Super-prompts

## Overview
This collection contains 15 powerful AI prompts specifically designed for SEO optimization.

## Prompts Include:
- Keyword research automation
- Content optimization strategies
- Meta description generation
- Schema markup creation
- And much more!

## How to Use
Each prompt is designed to be used with ChatGPT, Claude, or other AI assistants to streamline your SEO workflow.',
  '📊',
  ARRAY['SEO', 'AI', 'Marketing', 'Prompts'],
  '',
  '',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The system to charge $500 for 4 hours of work',
  'Learn the exact framework to command premium rates for your services',
  '# The $500/4-Hour System

## Introduction
Discover how to position yourself as a premium service provider and charge what you''re truly worth.

## Key Components:
1. **Value-Based Pricing** - Price on outcomes, not time
2. **Premium Positioning** - How to present yourself as the expert
3. **Client Psychology** - Understanding what drives high-value clients
4. **Delivery Framework** - Maximizing efficiency while maintaining quality

## Implementation Steps:
- Audit your current pricing model
- Identify your unique value proposition
- Create premium service packages
- Master the sales conversation',
  '💰',
  ARRAY['Business', 'Pricing', 'Freelancing', 'Strategy'],
  '',
  '',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Building an n8n agency',
  'Complete guide to starting and scaling an automation agency using n8n',
  '# Building an n8n Agency

## What is n8n?
n8n is a powerful workflow automation tool that allows you to connect different services and automate business processes.

## Agency Model:
- **Service Offerings**: What automations to offer clients
- **Pricing Structure**: How to price automation projects
- **Client Acquisition**: Finding businesses that need automation
- **Delivery Process**: From consultation to implementation

## Technical Setup:
- n8n installation and configuration
- Common workflow templates
- Client onboarding process
- Maintenance and support strategies',
  '🔧',
  ARRAY['Automation', 'n8n', 'Agency', 'Business'],
  '',
  '',
  NOW(),
  NOW()
);

-- Add a few more sample courses
INSERT INTO courses (id, title, description, content, icon, tags, video_url, thumbnail_url, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  'The automated Fiverr blueprint to make $3k/month',
  'Step-by-step system to automate your Fiverr business and scale to $3k monthly',
  '# Automated Fiverr Blueprint

## The Strategy
Learn how to create a semi-automated Fiverr business that generates consistent monthly revenue.

## Core Components:
1. **Niche Selection** - Finding profitable, automatable services
2. **Gig Optimization** - Creating gigs that sell themselves
3. **Automation Tools** - Software and systems to reduce manual work
4. **Scaling Framework** - Growing from $500 to $3000+ per month

## Automation Areas:
- Customer communication templates
- Delivery process automation
- Quality control systems
- Upselling sequences',
  '🚀',
  ARRAY['Fiverr', 'Automation', 'Freelancing', 'Income'],
  '',
  '',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '+1,000 Perfect Copy Swipe File',
  'Massive collection of high-converting copy examples across all industries',
  '# +1,000 Perfect Copy Swipe File

## What''s Included:
Over 1,000 examples of high-converting copy across multiple formats and industries.

## Categories:
- **Email Subject Lines** - 200+ proven openers
- **Sales Pages** - Complete page breakdowns
- **Ad Copy** - Facebook, Google, LinkedIn examples
- **Email Sequences** - Welcome, nurture, and sales sequences
- **Headlines** - Attention-grabbing headlines that convert

## How to Use:
- Study the patterns and formulas
- Adapt examples to your industry
- Test variations for your audience
- Build your own swipe file library',
  '📝',
  ARRAY['Copywriting', 'Marketing', 'Sales', 'Templates'],
  '',
  '',
  NOW(),
  NOW()
);
