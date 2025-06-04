-- Add new columns for suggested_by information
ALTER TABLE bucket_list_items
ADD COLUMN suggested_by text,
  ADD COLUMN suggested_by_avatar text,
  ADD COLUMN price integer;