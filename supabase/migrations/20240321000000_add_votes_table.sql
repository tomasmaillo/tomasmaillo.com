-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  winner_id UUID REFERENCES bucket_list_items(id),
  loser_id UUID REFERENCES bucket_list_items(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Add RLS policies
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON votes FOR
SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON votes FOR
INSERT WITH CHECK (true);