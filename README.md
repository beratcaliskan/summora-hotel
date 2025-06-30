# Summora Hotel Website

Modern, responsive ve çoklu dil destekli otel rezervasyon sitesi. React, Next.js, Tailwind CSS ve Supabase teknolojileri kullanılarak geliştirilmiştir.

## Özellikler

- 🏨 Modern ve responsive tasarım
- 🌍 Çoklu dil desteği (Türkçe/İngilizce)
- 📅 Takvim ile tarih seçimi
- 🛏️ Farklı oda tipleri ve fiyatlandırma
- 📝 Online rezervasyon formu
- 💬 İletişim formu
- 🎨 Gradient tasarım ve animasyonlar
- 📱 Mobil uyumlu

## Teknolojiler

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Database**: Supabase
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Kurulum

1. **Projeyi klonlayın**:
   ```bash
   git clone [repository-url]
   cd summora-hotel
   ```

2. **Bağımlılıkları kurun**:
   ```bash
   npm install
   ```

3. **Environment variables ayarlayın**:
   `.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Development server'ı başlatın**:
   ```bash
   npm run dev
   ```

5. Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Supabase Kurulumu

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. Aşağıdaki tabloları oluşturun:

### Reservations Tablosu
```sql
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  room_type TEXT NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);
```

### Contacts Tablosu
```sql
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL
);
```

## Scripts

- `npm run dev` - Development server'ı başlatır
- `npm run build` - Üretim için build alır
- `npm run start` - Production server'ı başlatır
- `npm run lint` - ESLint çalıştırır

## Proje Yapısı

```
summora-hotel/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Ana sayfa
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global stiller
│   ├── components/
│   │   ├── ui/               # UI bileşenleri
│   │   └── language-selector.tsx
│   ├── hooks/
│   │   └── useLanguage.ts    # Dil değiştirme hook'u
│   └── lib/
│       ├── utils.ts          # Utility fonksiyonlar
│       └── supabase.ts       # Supabase client
├── public/                   # Statik dosyalar
└── package.json
```

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

- **E-posta**: info@summora.com
- **Telefon**: +90 212 555 0123
- **Adres**: Beyoğlu, İstiklal Caddesi No:123, İstanbul
