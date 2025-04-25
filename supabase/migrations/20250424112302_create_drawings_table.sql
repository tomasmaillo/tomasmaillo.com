create table drawings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz default now(),
  image_url text not null,
  is_flagged boolean default false,
  reviewed boolean default false
);
