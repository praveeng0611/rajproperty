-- ═══════════════════════════════════════════════════════
--  Raj Property — Supabase Schema + Dummy Data
--  Run this in: Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS properties (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title            TEXT        NOT NULL,
  type             TEXT        NOT NULL CHECK (type IN ('plot','house','flat','commercial','agricultural')),
  price            NUMERIC     NOT NULL,
  price_unit       TEXT        DEFAULT 'lakh'  CHECK (price_unit IN ('lakh','crore','total')),
  area             NUMERIC     NOT NULL,
  area_unit        TEXT        DEFAULT 'sqft'  CHECK (area_unit IN ('sqft','sqyard','bigha','acre','sqmeter')),
  location         TEXT        NOT NULL,
  description      TEXT,
  features         TEXT[]      DEFAULT '{}',
  contact_phone    TEXT,
  contact_whatsapp TEXT,
  status           TEXT        DEFAULT 'available' CHECK (status IN ('available','sold','pending')),
  featured         BOOLEAN     DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Allow public read access (no auth required to view listings)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read available" ON properties
  FOR SELECT USING (true);

-- ── Dummy Listings ────────────────────────────────────────────────────────
INSERT INTO properties (title, type, price, price_unit, area, area_unit, location, description, features, contact_phone, contact_whatsapp, status, featured) VALUES

('Residential Plot Near Rajsamand Lake',
 'plot', 18, 'lakh', 220, 'sqyard',
 'Rajsamand City',
 'Prime residential plot situated near the famous Rajsamand Lake. Excellent connectivity to main market, schools, and hospitals. RUDA approved layout with all utilities available.',
 ARRAY['RUDA Approved','Corner Plot','Road Facing','All Utilities Available','Near Rajsamand Lake'],
 '+91 98765 43210', '+91 98765 43210', 'available', true),

('3 BHK Ready-to-Move House in Kankroli',
 'house', 52, 'lakh', 1450, 'sqft',
 'Kankroli',
 'Spacious 3 BHK house in the heart of Kankroli, just 2 km from Dwarkadheesh Temple. Ground + 1 floor construction with a dedicated parking space and small garden.',
 ARRAY['3 BHK','2 Bathrooms','Parking','Garden','Bore Well','Ground + 1 Floor'],
 '+91 98765 43210', '+91 98765 43210', 'available', true),

('Agricultural Land — 3 Bigha Near Bhim',
 'agricultural', 9, 'lakh', 3, 'bigha',
 'Bhim',
 'Fertile agricultural land with water source access. Suitable for farming or future development. Located on a paved road with easy vehicle access throughout the year.',
 ARRAY['Water Source Available','Paved Road Access','Fertile Soil','Clear Title','Year-round Access'],
 '+91 98765 43210', '+91 98765 43210', 'available', false),

('2 BHK Flat in Nathdwara',
 'flat', 31, 'lakh', 950, 'sqft',
 'Nathdwara',
 'Well-maintained 2 BHK flat in a newly constructed apartment complex in Nathdwara. Walking distance from the famous Shrinathji Temple. Ideal for pilgrimage town residents or rental investment.',
 ARRAY['2 BHK','1 Bathroom','Lift','Security','Parking','Near Shrinathji Temple'],
 '+91 98765 43210', '+91 98765 43210', 'available', false),

('Commercial Shop on Main Road — Railmagra',
 'commercial', 24, 'lakh', 480, 'sqft',
 'Railmagra',
 'Prime commercial shop on the busy Railmagra main market road. High footfall location, ground floor, fully constructed. Suitable for retail, medical store, or office use.',
 ARRAY['Main Road Facing','Ground Floor','High Footfall','Power Connection','Water Available'],
 '+91 98765 43210', '+91 98765 43210', 'available', false),

('Plot in Devgarh Township',
 'plot', 14, 'lakh', 300, 'sqyard',
 'Devgarh',
 'Approved residential plot in a developing township area of Devgarh. Peaceful location with a view of the Aravalli hills. Suitable for building your dream weekend home or investment.',
 ARRAY['Approved Layout','Aravalli View','Peaceful Location','Road Access','Development Zone'],
 '+91 98765 43210', '+91 98765 43210', 'available', false),

('Spacious House with Open Land in Amet',
 'house', 68, 'lakh', 2100, 'sqft',
 'Amet',
 'Impressive 4 BHK house with a large open plot attached. Ground floor with RCC construction, open terrace, and a large open yard ideal for a family home with expansion potential.',
 ARRAY['4 BHK','3 Bathrooms','Open Yard','RCC Construction','Borewell','Terrace'],
 '+91 98765 43210', '+91 98765 43210', 'available', false),

('Agricultural Land — 5 Bigha with Well',
 'agricultural', 38, 'lakh', 5, 'bigha',
 'Khamnor',
 'Prime agricultural land near Khamnor with an existing open well and partial bund fencing. Suitable for horticulture, farming, or long-term investment close to Rajsamand district.',
 ARRAY['Open Well','Partial Fencing','Road Connectivity','Clear Pattas','Investment Grade'],
 '+91 98765 43210', '+91 98765 43210', 'available', false);
