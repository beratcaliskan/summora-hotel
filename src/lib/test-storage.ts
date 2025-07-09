import { supabase } from './supabase'

// Test storage bucket setup
export async function testStorageBucket() {
  console.log('🧪 Testing storage bucket setup...')
  
  try {
    // 1. Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError)
      console.error('❌ Full error object:', JSON.stringify(bucketsError, null, 2))
      return false
    }
    
    console.log('📦 All available buckets:', buckets)
    
    const roomPhotosBucket = buckets?.find(b => b.name === 'room-photos')
    if (!roomPhotosBucket) {
      console.error('❌ room-photos bucket not found!')
      console.error('❌ Available bucket names:', buckets?.map(b => b.name))
      return false
    }
    
    console.log('✅ room-photos bucket exists:', roomPhotosBucket)
    
    // 2. Test public URL generation
    const testPath = '1/test-image.jpg'
    const { data: { publicUrl } } = supabase.storage
      .from('room-photos')
      .getPublicUrl(testPath)
    
    console.log('✅ Test public URL generated:', publicUrl)
    
    // 3. Check environment variables
    console.log('🔧 Environment variables:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')
    
    // 4. Test database connection
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('id, featured_image_url')
      .limit(1)
    
    if (roomsError) {
      console.error('❌ Database connection error:', roomsError)
      return false
    }
    
    console.log('✅ Database connection OK, sample room:', rooms?.[0])
    
    return true
  } catch (error) {
    console.error('❌ Storage test failed:', error)
    return false
  }
}

// Test photo URL accessibility
export async function testPhotoUrl(url: string) {
  console.log('🧪 Testing photo URL accessibility:', url)
  
  try {
    const response = await fetch(url)
    console.log('📡 Response status:', response.status)
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      console.log('✅ Photo URL is accessible')
      return true
    } else {
      console.error('❌ Photo URL not accessible:', response.statusText)
      return false
    }
  } catch (error) {
    console.error('❌ Error testing photo URL:', error)
    return false
  }
}

// Debug room photos
export async function debugRoomPhotos(roomId: number) {
  console.log(`🧪 Debugging room photos for room ID: ${roomId}`)
  
  try {
    // Get room photos from database
    const { data: photos, error } = await supabase
      .from('room_photos')
      .select('*')
      .eq('room_id', roomId)
      .order('display_order')
    
    if (error) {
      console.error('❌ Error fetching room photos:', error)
      return
    }
    
    console.log('📸 Room photos from database:', photos)
    
    // Test each photo URL
    for (const photo of photos || []) {
      const { data: { publicUrl } } = supabase.storage
        .from('room-photos')
        .getPublicUrl(photo.image_url)
      
      console.log(`📷 Photo ${photo.id}:`)
      console.log(`  - Database path: ${photo.image_url}`)
      console.log(`  - Public URL: ${publicUrl}`)
      
      // Test if URL is accessible
      await testPhotoUrl(publicUrl)
    }
    
  } catch (error) {
    console.error('❌ Debug room photos failed:', error)
  }
} 