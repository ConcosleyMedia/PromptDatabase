 -- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type prompt_type as enum ('text', 'image', 'video');
create type prompt_status as enum ('draft', 'published', 'archived');
create type import_status as enum ('pending', 'processing', 'completed', 'failed');

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  whop_user_id text unique,
  username text unique,
  email text unique,
  display_name text,
  avatar_url text,
  is_admin boolean default false,
  credits integer default 0, -- for future OpenRouter integration
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories table for organizing prompts
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  description text,
  color text default '#6366f1', -- hex color for UI
  icon text, -- lucide icon name
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Import batches table for tracking CSV imports
create table public.import_batches (
  id uuid default uuid_generate_v4() primary key,
  filename text not null,
  imported_by uuid references public.users(id) on delete set null,
  prompt_count integer default 0,
  success_count integer default 0,
  error_count integer default 0,
  status import_status default 'pending',
  error_log jsonb default '[]',
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Prompts table (unified for all prompt types)
create table public.prompts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  description text,
  type prompt_type not null default 'text',
  status prompt_status not null default 'published',
  
  -- Categorization
  category text references public.categories(name) on delete set null,
  tags text[] default '{}',
  
  -- Platform-specific fields (for image/video prompts)
  platform text, -- e.g., 'midjourney', 'dalle', 'stable-diffusion', 'chatgpt'
  style text, -- e.g., 'cyberpunk', 'realistic', 'cartoon'
  model_version text, -- e.g., 'v5.2', 'gpt-4'
  
  -- Media fields
  image_url text, -- example image for image prompts
  example_output_url text, -- example output
  parameters jsonb default '{}', -- store platform-specific parameters
  
  -- AI-extracted metadata
  metadata jsonb default '{}', -- store AI analysis results
  
  -- Statistics
  view_count integer default 0,
  vote_count integer default 0,
  save_count integer default 0,
  
  -- Tracking
  created_by uuid references public.users(id) on delete set null,
  import_batch_id uuid references public.import_batches(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User votes on prompts
create table public.prompt_votes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  prompt_id uuid references public.prompts(id) on delete cascade not null,
  vote_type text check (vote_type in ('up', 'down')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, prompt_id)
);

-- User saved prompts
create table public.saved_prompts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  prompt_id uuid references public.prompts(id) on delete cascade not null,
  folder_name text default 'general', -- for future organization
  notes text, -- user's personal notes
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, prompt_id)
);

-- Prompt views for tracking popularity
create table public.prompt_views (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete set null,
  prompt_id uuid references public.prompts(id) on delete cascade not null,
  session_id text, -- for anonymous users
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Prompt submissions from users (for future feature)
create table public.prompt_submissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  type prompt_type not null default 'text',
  category text,
  tags text[] default '{}',
  platform text,
  style text,
  metadata jsonb default '{}',
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  review_notes text,
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- API usage tracking (for future OpenRouter integration)
create table public.api_usage (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  prompt_id uuid references public.prompts(id) on delete set null,
  model_used text not null,
  input_tokens integer default 0,
  output_tokens integer default 0,
  credits_used integer default 0,
  response_time_ms integer,
  error text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default categories
insert into public.categories (name, description, color, icon, sort_order) values
  ('coding', 'Programming, debugging, and development prompts', '#10b981', 'code', 1),
  ('marketing', 'Marketing, advertising, and growth strategies', '#8b5cf6', 'megaphone', 2),
  ('writing', 'Content creation, copywriting, and storytelling', '#f59e0b', 'pen-tool', 3),
  ('design', 'UI/UX, graphics, and visual design prompts', '#ec4899', 'palette', 4),
  ('education', 'Learning, teaching, and educational content', '#06b6d4', 'graduation-cap', 5),
  ('business', 'Strategy, analysis, and business planning', '#3b82f6', 'briefcase', 6),
  ('art', 'Creative artwork, illustrations, and visual art', '#ef4444', 'brush', 7),
  ('productivity', 'Efficiency, automation, and workflow optimization', '#f97316', 'zap', 8),
  ('data', 'Analytics, research, and data science', '#14b8a6', 'bar-chart', 9),
  ('other', 'Miscellaneous and uncategorized prompts', '#6b7280', 'folder', 10);

-- Create indexes for performance
create index idx_prompts_type on public.prompts(type);
create index idx_prompts_category on public.prompts(category);
create index idx_prompts_status on public.prompts(status);
create index idx_prompts_platform on public.prompts(platform);
create index idx_prompts_created_at on public.prompts(created_at desc);
create index idx_prompts_vote_count on public.prompts(vote_count desc);
create index idx_prompts_view_count on public.prompts(view_count desc);
create index idx_prompts_save_count on public.prompts(save_count desc);
create index idx_prompts_tags on public.prompts using gin(tags);
create index idx_prompt_votes_user_prompt on public.prompt_votes(user_id, prompt_id);
create index idx_saved_prompts_user on public.saved_prompts(user_id);
create index idx_saved_prompts_user_folder on public.saved_prompts(user_id, folder_name);
create index idx_prompt_views_prompt_created on public.prompt_views(prompt_id, created_at);
create index idx_import_batches_status on public.import_batches(status);

-- Create text search indexes
create index idx_prompts_title_search on public.prompts using gin(to_tsvector('english', title));
create index idx_prompts_content_search on public.prompts using gin(to_tsvector('english', content));
create index idx_prompts_combined_search on public.prompts using gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(description, ''))
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.prompts enable row level security;
alter table public.prompt_votes enable row level security;
alter table public.saved_prompts enable row level security;
alter table public.prompt_views enable row level security;
alter table public.categories enable row level security;
alter table public.import_batches enable row level security;
alter table public.prompt_submissions enable row level security;
alter table public.api_usage enable row level security;

-- RLS Policies

-- Users: Can view all users (for leaderboards), but only edit own profile
create policy "Users can view all users" on public.users
  for select using (true);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Prompts: Published prompts are viewable by all, only admins can modify
create policy "Anyone can view published prompts" on public.prompts
  for select using (status = 'published');

create policy "Admins can do anything with prompts" on public.prompts
  for all using (
    exists (
      select 1 from public.users
      where id = auth.uid() and is_admin = true
    )
  );

-- Prompt votes: Users can vote and see all votes
create policy "Users can manage own votes" on public.prompt_votes
  for all using (auth.uid() = user_id);

create policy "Anyone can view votes" on public.prompt_votes
  for select using (true);

-- Saved prompts: Users can only manage their own saved prompts
create policy "Users can manage own saved prompts" on public.saved_prompts
  for all using (auth.uid() = user_id);

-- Prompt views: Anyone can create views, users can see their own
create policy "Anyone can create prompt views" on public.prompt_views
  for insert with check (true);

create policy "Users can view own prompt views" on public.prompt_views
  for select using (auth.uid() = user_id or auth.uid() in (
    select id from public.users where is_admin = true
  ));

-- Categories: Anyone can view, only admins can modify
create policy "Anyone can view categories" on public.categories
  for select using (true);

create policy "Admins can manage categories" on public.categories
  for all using (
    exists (
      select 1 from public.users
      where id = auth.uid() and is_admin = true
    )
  );

-- Import batches: Admins only
create policy "Admins can manage import batches" on public.import_batches
  for all using (
    exists (
      select 1 from public.users
      where id = auth.uid() and is_admin = true
    )
  );

-- Prompt submissions: Users can submit and view own, admins can see all
create policy "Users can create submissions" on public.prompt_submissions
  for insert with check (auth.uid() = user_id);

create policy "Users can view own submissions" on public.prompt_submissions
  for select using (auth.uid() = user_id or exists (
    select 1 from public.users where id = auth.uid() and is_admin = true
  ));

create policy "Admins can manage submissions" on public.prompt_submissions
  for all using (
    exists (
      select 1 from public.users
      where id = auth.uid() and is_admin = true
    )
  );

-- API usage: Users can only see their own usage
create policy "Users can view own API usage" on public.api_usage
  for select using (auth.uid() = user_id);

create policy "Users can create own API usage" on public.api_usage
  for insert with check (auth.uid() = user_id);

-- Helper Functions

-- Function to check if user is admin
create or replace function is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.users
    where id = user_id and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- Function to update prompt vote count
create or replace function update_prompt_vote_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.prompts
    set vote_count = vote_count + case when NEW.vote_type = 'up' then 1 else -1 end,
        updated_at = now()
    where id = NEW.prompt_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.prompts
    set vote_count = vote_count - case when OLD.vote_type = 'up' then 1 else -1 end,
        updated_at = now()
    where id = OLD.prompt_id;
    return OLD;
  elsif TG_OP = 'UPDATE' then
    update public.prompts
    set vote_count = vote_count +
      case when NEW.vote_type = 'up' then 1 else -1 end -
      case when OLD.vote_type = 'up' then 1 else -1 end,
      updated_at = now()
    where id = NEW.prompt_id;
    return NEW;
  end if;
  return null;
end;
$$ language plpgsql;

-- Function to update prompt save count
create or replace function update_prompt_save_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.prompts
    set save_count = save_count + 1,
        updated_at = now()
    where id = NEW.prompt_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.prompts
    set save_count = save_count - 1,
        updated_at = now()
    where id = OLD.prompt_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql;

-- Triggers for updating counters
create trigger prompt_vote_count_trigger
  after insert or update or delete on public.prompt_votes
  for each row execute function update_prompt_vote_count();

create trigger prompt_save_count_trigger
  after insert or delete on public.saved_prompts
  for each row execute function update_prompt_save_count();

-- Function to handle new user creation from auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to increment view count with rate limiting
create or replace function increment_prompt_views(
  prompt_uuid uuid,
  user_uuid uuid default null,
  session_uuid text default null,
  user_ip inet default null,
  user_agent_string text default null
)
returns void as $$
declare
  existing_view_id uuid;
begin
  -- Check if user/session has viewed this prompt in the last hour
  select id into existing_view_id
  from public.prompt_views
  where prompt_id = prompt_uuid
    and (
      (user_uuid is not null and user_id = user_uuid) or
      (session_uuid is not null and session_id = session_uuid) or
      (user_ip is not null and ip_address = user_ip)
    )
    and created_at > now() - interval '1 hour'
  limit 1;

  -- Only create new view if no recent view exists
  if existing_view_id is null then
    insert into public.prompt_views (prompt_id, user_id, session_id, ip_address, user_agent)
    values (prompt_uuid, user_uuid, session_uuid, user_ip, user_agent_string);

    -- Update view count on prompt
    update public.prompts
    set view_count = view_count + 1
    where id = prompt_uuid;
  end if;
end;
$$ language plpgsql security definer;

-- Function to search prompts with filters
create or replace function search_prompts(
  search_query text default null,
  prompt_type_filter prompt_type default null,
  category_filter text default null,
  platform_filter text default null,
  tags_filter text[] default null,
  sort_by text default 'created_at',
  sort_order text default 'desc',
  limit_count integer default 20,
  offset_count integer default 0
)
returns table (
  id uuid,
  title text,
  content text,
  description text,
  type prompt_type,
  category text,
  tags text[],
  platform text,
  style text,
  image_url text,
  view_count integer,
  vote_count integer,
  save_count integer,
  created_at timestamp with time zone,
  relevance real
) as $$
begin
  return query
  select 
    p.id,
    p.title,
    p.content,
    p.description,
    p.type,
    p.category,
    p.tags,
    p.platform,
    p.style,
    p.image_url,
    p.view_count,
    p.vote_count,
    p.save_count,
    p.created_at,
    case 
      when search_query is not null then
        ts_rank(to_tsvector('english', p.title || ' ' || p.content), plainto_tsquery('english', search_query))
      else 0::real
    end as relevance
  from public.prompts p
  where p.status = 'published'
    and (prompt_type_filter is null or p.type = prompt_type_filter)
    and (category_filter is null or p.category = category_filter)
    and (platform_filter is null or p.platform = platform_filter)
    and (tags_filter is null or p.tags && tags_filter)
    and (
      search_query is null or
      to_tsvector('english', p.title || ' ' || p.content) @@ plainto_tsquery('english', search_query)
    )
  order by
    case when sort_by = 'relevance' and search_query is not null then
      ts_rank(to_tsvector('english', p.title || ' ' || p.content), plainto_tsquery('english', search_query))
    end desc nulls last,
    case when sort_by = 'created_at' and sort_order = 'desc' then p.created_at end desc,
    case when sort_by = 'created_at' and sort_order = 'asc' then p.created_at end asc,
    case when sort_by = 'vote_count' and sort_order = 'desc' then p.vote_count end desc,
    case when sort_by = 'vote_count' and sort_order = 'asc' then p.vote_count end asc,
    case when sort_by = 'view_count' and sort_order = 'desc' then p.view_count end desc,
    case when sort_by = 'view_count' and sort_order = 'asc' then p.view_count end asc
  limit limit_count
  offset offset_count;
end;
$$ language plpgsql security definer;

-- Function to get user's saved prompts with prompt details
create or replace function get_user_saved_prompts(user_uuid uuid)
returns table (
  prompt_id uuid,
  title text,
  content text,
  type prompt_type,
  category text,
  tags text[],
  platform text,
  saved_at timestamp with time zone,
  folder_name text,
  notes text
) as $$
begin
  return query
  select 
    p.id,
    p.title,
    p.content,
    p.type,
    p.category,
    p.tags,
    p.platform,
    sp.created_at,
    sp.folder_name,
    sp.notes
  from public.saved_prompts sp
  join public.prompts p on p.id = sp.prompt_id
  where sp.user_id = user_uuid
    and p.status = 'published'
  order by sp.created_at desc;
end;
$$ language plpgsql security definer;