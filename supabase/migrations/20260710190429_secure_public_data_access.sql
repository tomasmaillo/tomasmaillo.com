-- Public clients may only read content intended for the website. All writes
-- are performed by server-side routes using a Supabase secret key.

alter table public.drawings enable row level security;
alter table public.bucket_list_items enable row level security;

drop policy if exists "Public can view approved drawings" on public.drawings;
create policy "Public can view approved drawings"
on public.drawings
for select
to anon, authenticated
using (reviewed is true and is_flagged is false);

drop policy if exists "Public can view bucket list items" on public.bucket_list_items;
create policy "Public can view bucket list items"
on public.bucket_list_items
for select
to anon, authenticated
using (true);

drop policy if exists "Enable insert access for all users" on public.votes;
drop policy if exists "Enable read access for all users" on public.votes;

create policy "Public can view vote count"
on public.votes
for select
to anon, authenticated
using (true);

revoke all on table public.drawings from anon, authenticated;
grant select on table public.drawings to anon, authenticated;

revoke all on table public.bucket_list_items from anon, authenticated;
grant select on table public.bucket_list_items to anon, authenticated;

revoke all on table public.votes from anon, authenticated;
grant select on table public.votes to anon, authenticated;

drop function if exists public.record_bucket_list_vote(uuid, uuid);
create function public.record_bucket_list_vote(p_winner_id uuid, p_loser_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  winner_elo integer;
  loser_elo integer;
  winner_completed boolean;
  loser_completed boolean;
  expected_winner double precision;
  expected_loser double precision;
  new_winner_elo integer;
  new_loser_elo integer;
begin
  if p_winner_id = p_loser_id then
    raise exception 'Winner and loser must be different items';
  end if;

  select elo_score, completed
  into winner_elo, winner_completed
  from public.bucket_list_items
  where id = p_winner_id
  for update;

  select elo_score, completed
  into loser_elo, loser_completed
  from public.bucket_list_items
  where id = p_loser_id
  for update;

  if winner_elo is null or loser_elo is null then
    raise exception 'Bucket list item not found';
  end if;

  if winner_completed is true or loser_completed is true then
    raise exception 'Completed items cannot be ranked';
  end if;

  expected_winner := 1.0 / (
    1.0 + power(10.0, (loser_elo - winner_elo) / 400.0)
  );
  expected_loser := 1.0 - expected_winner;
  new_winner_elo := winner_elo + 32 * (1 - expected_winner);
  new_loser_elo := loser_elo + 32 * (0 - expected_loser);

  update public.bucket_list_items
  set elo_score = new_winner_elo
  where id = p_winner_id;

  update public.bucket_list_items
  set elo_score = new_loser_elo
  where id = p_loser_id;

  insert into public.votes (winner_id, loser_id)
  values (p_winner_id, p_loser_id);
end;
$$;

revoke all on function public.record_bucket_list_vote(uuid, uuid) from public;
revoke all on function public.record_bucket_list_vote(uuid, uuid) from anon;
revoke all on function public.record_bucket_list_vote(uuid, uuid) from authenticated;
grant execute on function public.record_bucket_list_vote(uuid, uuid) to service_role;

revoke all on function public.update_elo_scores(uuid, uuid, integer) from public;
revoke all on function public.update_elo_scores(uuid, uuid, integer) from anon;
revoke all on function public.update_elo_scores(uuid, uuid, integer) from authenticated;
grant execute on function public.update_elo_scores(uuid, uuid, integer) to service_role;

alter function public.update_elo_scores(uuid, uuid, integer)
set search_path = '';

alter function public.update_updated_at_column()
set search_path = '';

drop policy if exists "Allow insert for all 1ld6hp1_0" on storage.objects;
