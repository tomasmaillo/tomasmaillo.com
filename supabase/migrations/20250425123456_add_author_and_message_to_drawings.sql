-- Add author and message fields to drawings table
ALTER TABLE drawings
ADD COLUMN author_name text DEFAULT 'anonymous',
  ADD COLUMN author_title text DEFAULT 'pencil',
  ADD COLUMN message text DEFAULT '';
-- Add a comment to explain the fields
COMMENT ON COLUMN drawings.author_name IS 'The name of the drawing author (defaults to anonymous)';
COMMENT ON COLUMN drawings.author_title IS 'The title/description of the author (defaults to pencil)';
COMMENT ON COLUMN drawings.message IS 'Optional message added by the author to their drawing';