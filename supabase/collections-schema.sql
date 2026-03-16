-- Saved Collections: folders and videos tables
-- Run this in your Supabase SQL editor to create the tables.

-- Folders: one per user, named (e.g. "STRONG HOOKS")
create table if not exists folders (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  name text not null,
  created_at timestamptz default now()
);

-- Videos: TikTok links stored per folder
create table if not exists videos (
  id uuid primary key default uuid_generate_v4(),
  folder_id uuid not null references folders(id) on delete cascade,
  original_url text not null,
  video_id text not null,
  transcript text,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index if not exists idx_folders_user_id on folders(user_id);
create index if not exists idx_videos_folder_id on videos(folder_id);

-- RLS (optional): enable if you use Supabase Auth and want row-level security
-- alter table folders enable row level security;
-- alter table videos enable row level security;
-- create policy "Users can manage own folders" on folders for all using (auth.uid()::text = user_id);
-- create policy "Users can manage videos in own folders" on videos for all using (
--   exists (select 1 from folders where folders.id = videos.folder_id and folders.user_id = auth.uid()::text)
-- );
