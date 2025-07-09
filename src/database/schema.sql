-- Rooms tablosunu oluştur
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  title JSONB NOT NULL CHECK (
    jsonb_typeof(title->'tr') = 'string' AND
    jsonb_typeof(title->'en') = 'string'
  ),
  description JSONB CHECK (
    (description IS NULL) OR (
      jsonb_typeof(description->'tr') = 'string' AND
      jsonb_typeof(description->'en') = 'string'
    )
  ),
  size TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  amenities TEXT[] NOT NULL,
  room_type TEXT NOT NULL CHECK (room_type IN ('standard', 'deluxe', 'suite', 'presidential'))
);

-- Reservations tablosunu oluştur
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  room_id UUID REFERENCES rooms(id) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_price INTEGER NOT NULL
);

-- Örnek veriler
INSERT INTO rooms (
  title,
  description,
  size,
  capacity,
  price,
  image_url,
  amenities,
  room_type
) VALUES
(
  '{"tr": "Standart Oda", "en": "Standard Room"}',
  '{"tr": "Şehir manzaralı, konforlu ve modern dekore edilmiş odalarımız sizleri bekliyor.", "en": "Our comfortable and modernly decorated rooms with city views await you."}',
  '25m²',
  2,
  1500,
  '/rooms/standard.jpg',
  ARRAY['TV', 'Wi-Fi', 'Minibar', 'Safe'],
  'standard'
),
(
  '{"tr": "Deluxe Oda", "en": "Deluxe Room"}',
  '{"tr": "Geniş ve ferah deluxe odalarımızda şehir manzarasının keyfini çıkarın.", "en": "Enjoy the city view in our spacious and airy deluxe rooms."}',
  '35m²',
  2,
  2500,
  '/rooms/deluxe.jpg',
  ARRAY['TV', 'Wi-Fi', 'Minibar', 'Safe', 'Balcony', 'City View'],
  'deluxe'
),
(
  '{"tr": "Suit Oda", "en": "Suite Room"}',
  '{"tr": "Deniz manzaralı suit odalarımızda lüks ve konforun tadını çıkarın.", "en": "Experience luxury and comfort in our sea view suite rooms."}',
  '50m²',
  3,
  3500,
  '/rooms/suite.jpg',
  ARRAY['TV', 'Wi-Fi', 'Minibar', 'Safe', 'Balcony', 'Sea View', 'Living Room'],
  'suite'
),
(
  '{"tr": "Presidential Suit", "en": "Presidential Suite"}',
  '{"tr": "En üst katta yer alan presidential suit odamızda özel havuz ve muhteşem manzaranın keyfini çıkarın.", "en": "Enjoy a private pool and stunning views in our presidential suite located on the top floor."}',
  '100m²',
  4,
  5000,
  '/rooms/presidential.jpg',
  ARRAY['TV', 'Wi-Fi', 'Minibar', 'Safe', 'Balcony', 'Sea View', 'Living Room', 'Kitchen', 'Private Pool'],
  'presidential'
); 