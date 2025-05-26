create table bucket_list_items (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  completed boolean default false,
  elo_score integer default 1500,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- Create a function to update the updated_at timestamp
create or replace function update_updated_at_column() returns trigger as $$ begin new.updated_at = now();
return new;
end;
$$ language plpgsql;
-- Create a trigger to automatically update the updated_at column
create trigger update_bucket_list_items_updated_at before
update on bucket_list_items for each row execute function update_updated_at_column();
-- Create a function to update ELO scores after a comparison
create or replace function update_elo_scores(
    winner_id uuid,
    loser_id uuid,
    k_factor integer default 32
  ) returns void as $$
declare winner_elo integer;
loser_elo integer;
expected_winner float;
expected_loser float;
new_winner_elo integer;
new_loser_elo integer;
begin -- Get current ELO scores
select elo_score into winner_elo
from bucket_list_items
where id = winner_id;
select elo_score into loser_elo
from bucket_list_items
where id = loser_id;
-- Calculate expected scores
expected_winner := 1.0 / (
  1.0 + power(10.0, (loser_elo - winner_elo) / 400.0)
);
expected_loser := 1.0 - expected_winner;
-- Calculate new ELO scores
new_winner_elo := winner_elo + k_factor * (1 - expected_winner);
new_loser_elo := loser_elo + k_factor * (0 - expected_loser);
-- Update scores
update bucket_list_items
set elo_score = new_winner_elo
where id = winner_id;
update bucket_list_items
set elo_score = new_loser_elo
where id = loser_id;
end;
$$ language plpgsql;