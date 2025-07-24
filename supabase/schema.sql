-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  nickname TEXT,
  elements JSONB NOT NULL DEFAULT '[]',
  settings JSONB NOT NULL DEFAULT '{"title": "", "primaryColor": "#3b82f6", "backgroundColor": "#ffffff"}',
  is_template BOOLEAN DEFAULT FALSE,
  template_name TEXT,
  template_description TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  published_url TEXT,
  page_views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create google_sheets_config table
CREATE TABLE IF NOT EXISTS google_sheets_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spreadsheet_id TEXT NOT NULL,
  sheet_name TEXT DEFAULT 'Sheet1',
  service_account_key JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_created_at ON pages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_is_template ON pages(is_template);
CREATE INDEX IF NOT EXISTS idx_pages_is_published ON pages(is_published);
CREATE INDEX IF NOT EXISTS idx_pages_published_url ON pages(published_url);
CREATE INDEX IF NOT EXISTS idx_form_submissions_page_id ON form_submissions(page_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_google_sheets_config_is_active ON google_sheets_config(is_active);

-- Update updated_at timestamp on pages update
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable RLS (Row Level Security) for future auth integration
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_sheets_config ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (can be restricted later with auth)
CREATE POLICY "Allow all operations on pages" ON pages FOR ALL USING (true);
CREATE POLICY "Allow all operations on form_submissions" ON form_submissions FOR ALL USING (true);
CREATE POLICY "Allow all operations on google_sheets_config" ON google_sheets_config FOR ALL USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Allow public access to images bucket
CREATE POLICY "Public Access for images bucket" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Allow image uploads" ON storage.objects FOR INSERT USING (bucket_id = 'images');
CREATE POLICY "Allow image updates" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Allow image deletes" ON storage.objects FOR DELETE USING (bucket_id = 'images');