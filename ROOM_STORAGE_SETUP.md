# Room Photo Storage Setup Guide

Bu rehber, self-hosted Supabase ile oda fotoğrafları için storage sistemini kurmanızı sağlar.

## 📋 Özellikler

- ✅ Sequential ID'ler (1, 2, 3, 4...)
- ✅ Vitrin fotoğrafı (featured photo) sistemi
- ✅ Oda başına maksimum 20 fotoğraf
- ✅ Drag & drop fotoğraf upload
- ✅ Fotoğraf sıralama sistemi
- ✅ 5MB maksimum dosya boyutu
- ✅ JPEG, PNG, WebP format desteği
- ✅ Self-hosted Supabase storage entegrasyonu

## 🛠️ Kurulum Adımları

### 1. Veritabanı Şemasını Güncelle

```sql
-- Mevcut schema'yı çalıştır
psql -h localhost -p 5433 -U postgres -d postgres < src/database/updated-schema.sql
```

### 2. Environment Variables

`.env.local` dosyasına şu değişkenleri ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8002
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Storage Bucket Kurulumu

```typescript
// Uygulama başlatıldığında çalıştır
import { completeSetup } from '@/lib/init-storage'

// Bir kez çalıştır
await completeSetup()
```

### 4. Storage Policies (Manuel)

Supabase Dashboard'da veya SQL ile şu policy'leri ekleyin:

```sql
-- Public read access
CREATE POLICY "Public can view room photos" ON storage.objects
FOR SELECT USING (bucket_id = 'room-photos');

-- Authenticated upload
CREATE POLICY "Authenticated users can upload room photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'room-photos' AND auth.role() = 'authenticated');

-- Authenticated delete
CREATE POLICY "Authenticated users can delete room photos" ON storage.objects
FOR DELETE USING (bucket_id = 'room-photos' AND auth.role() = 'authenticated');
```

## 📁 Dosya Yapısı

```
src/
├── database/
│   └── updated-schema.sql       # Güncellenmiş veritabanı şeması
├── lib/
│   ├── storage.ts              # Storage utility functions
│   └── init-storage.ts         # Storage initialization
├── types/
│   └── supabase.ts             # TypeScript types
└── components/
    └── admin/
        └── RoomPhotoUpload.tsx # Photo upload component
```

## 🗄️ Veritabanı Tabloları

### `rooms` Table
- `id` (INTEGER, Primary Key, Sequential)
- `featured_image_url` (TEXT) - Vitrin fotoğrafı
- `title`, `description`, `size`, `capacity`, `price`, `amenities`, `room_type`
- `is_active` (BOOLEAN)

### `room_photos` Table  
- `id` (SERIAL, Primary Key)
- `room_id` (INTEGER, Foreign Key)
- `image_url` (TEXT) - Storage path
- `image_name` (TEXT) - Orijinal dosya adı
- `image_size` (INTEGER) - Byte cinsinden
- `display_order` (INTEGER) - Gösterim sırası

### `reservations` Table
- `id` (INTEGER, Primary Key, Sequential)
- `room_id` (INTEGER, Foreign Key)
- `check_in`, `check_out`, `guest_name`, `guest_email`, `guest_phone`
- `status` ('pending' | 'confirmed' | 'cancelled')
- `total_price` (INTEGER)
- `notes` (TEXT)

## 🔧 Kullanım Örnekleri

### Vitrin Fotoğrafı Upload

```typescript
import { RoomPhotoManager } from '@/lib/storage'

const result = await RoomPhotoManager.uploadFeaturedPhoto(roomId, file)
if (result.success) {
  console.log('Featured photo uploaded:', result.data?.url)
}
```

### Galeri Fotoğrafı Upload

```typescript
const result = await RoomPhotoManager.uploadGalleryPhoto({
  roomId: 1,
  file: selectedFile,
  displayOrder: 1
})
```

### Fotoğrafları Getir

```typescript
const photos = await RoomPhotoManager.getRoomPhotos(roomId)
photos.forEach(photo => {
  console.log(photo.public_url, photo.display_order)
})
```

### Fotoğraf Sil

```typescript
const result = await RoomPhotoManager.deletePhoto(photoId)
if (result.success) {
  console.log('Photo deleted successfully')
}
```

## ⚛️ React Component Kullanımı

```tsx
import RoomPhotoUpload from '@/components/admin/RoomPhotoUpload'

function AdminPanel() {
  return (
    <RoomPhotoUpload
      roomId={1}
      onPhotoUploaded={(result) => console.log('Uploaded:', result)}
      onPhotoDeleted={(photoId) => console.log('Deleted:', photoId)}
    />
  )
}
```

## 📝 Storage Klasör Yapısı

```
room-photos/
├── 1/
│   ├── featured.jpg           # Vitrin fotoğrafı
│   ├── gallery-1234567890.jpg # Galeri fotoğrafı
│   └── gallery-1234567891.png # Galeri fotoğrafı
├── 2/
│   ├── featured.webp
│   └── gallery-1234567892.jpg
└── ...
```

## 🔒 Güvenlik Kuralları

1. **File Size Limit**: 5MB maksimum
2. **File Types**: JPEG, PNG, WebP only
3. **Photo Count**: Oda başına maksimum 20 fotoğraf
4. **Access Control**: Public read, authenticated write/delete
5. **Validation**: Client ve server-side validation

## 🚀 API Endpoints (Opsiyonel)

```typescript
// pages/api/rooms/[id]/photos.ts
import { RoomPhotoManager } from '@/lib/storage'

export default async function handler(req, res) {
  const { id } = req.query
  
  if (req.method === 'GET') {
    const photos = await RoomPhotoManager.getRoomPhotos(parseInt(id))
    res.json(photos)
  }
  
  if (req.method === 'POST') {
    // Handle photo upload
  }
}
```

## 📊 Storage İstatistikleri

```typescript
import { getStorageStats } from '@/lib/init-storage'

const stats = await getStorageStats()
console.log(`Total: ${stats.totalSizeMB}MB, Files: ${stats.fileCount}`)
```

## 🔧 Troubleshooting

### Common Issues:

1. **Bucket not found**: `await initializeStorage()` çalıştırın
2. **Permission denied**: Storage policies'i kontrol edin
3. **File too large**: 5MB limitini kontrol edin
4. **Invalid file type**: JPEG/PNG/WebP dışında format kabul edilmez

### Debug Commands:

```bash
# Storage durumunu kontrol et
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  http://localhost:8002/storage/v1/bucket/room-photos

# Bucket policies kontrol et
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  http://localhost:8002/storage/v1/bucket/room-photos/policies
```

## 🎯 Production Deployment

1. Environment variables'ı production'a kopyalayın
2. `completeSetup()` fonksiyonunu bir kez çalıştırın
3. Storage policies'i Supabase Dashboard'da aktif edin
4. CDN (opsiyonel) ekleyin

## 📈 Performance Optimizations

- Image resizing middleware ekleyin
- Lazy loading kullanın
- WebP format'ında optimize edin
- CDN kullanın
- Thumbnail generation sistemi ekleyin

---

✅ **Kurulum tamamlandı!** Artık room photo storage sisteminiz hazır. 