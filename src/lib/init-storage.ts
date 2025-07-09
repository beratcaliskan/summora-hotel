import { supabase } from './supabase'

/**
 * Initialize storage bucket for room photos
 * This should be run once during application setup
 */
export async function initializeStorage() {
  try {
    console.log('🔄 Initializing storage...')
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      return false
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'room-photos')
    
    if (!bucketExists) {
      console.log('🔄 Creating room-photos bucket...')
      
      // Create bucket
      const { error: createError } = await supabase.storage.createBucket('room-photos', {
        public: false,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      })
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError)
        return false
      }
      
      console.log('✅ Bucket created successfully')
    } else {
      console.log('✅ Bucket already exists')
    }
    
    // Setup storage policies (for public access to room photos)
    await setupStoragePolicies()
    
    console.log('✅ Storage initialization complete')
    return true
    
  } catch (error) {
    console.error('❌ Storage initialization failed:', error)
    return false
  }
}

/**
 * Setup storage policies for room photos
 * Note: This needs to be done manually in Supabase Dashboard or via SQL
 */
async function setupStoragePolicies() {
  try {
    console.log('🔄 Setting up storage policies...')
    
    // Storage policies need to be created manually in Supabase Dashboard
    // or via SQL commands. Add these policies in your Supabase project:
    /*
    -- Allow public read access to room photos
    CREATE POLICY "Public can view room photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'room-photos');
    
    -- Allow authenticated users to upload room photos
    CREATE POLICY "Authenticated users can upload room photos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'room-photos' AND auth.role() = 'authenticated');
    
    -- Allow authenticated users to delete room photos
    CREATE POLICY "Authenticated users can delete room photos" ON storage.objects
    FOR DELETE USING (bucket_id = 'room-photos' AND auth.role() = 'authenticated');
    */
    
    console.log('✅ Storage policies info provided (manual setup required)')
    
  } catch (error) {
    console.error('❌ Error setting up storage policies:', error)
  }
}

/**
 * Create initial folder structure in storage
 */
export async function createInitialFolders() {
  try {
    console.log('🔄 Creating initial folder structure...')
    
    // Create placeholder files for room folders (1-10)
    const folders = Array.from({ length: 10 }, (_, i) => i + 1)
    
    for (const folderId of folders) {
      const { error } = await supabase.storage
        .from('room-photos')
        .upload(`${folderId}/.keep`, new Blob([''], { type: 'text/plain' }), {
          upsert: true
        })
      
      if (error && !error.message.includes('already exists')) {
        console.error(`❌ Error creating folder ${folderId}:`, error)
      }
    }
    
    console.log('✅ Initial folder structure created')
    return true
    
  } catch (error) {
    console.error('❌ Error creating initial folders:', error)
    return false
  }
}

/**
 * Test storage functionality
 */
export async function testStorage() {
  try {
    console.log('🔄 Testing storage functionality...')
    
    // Test upload
    const testFile = new Blob(['test content'], { type: 'text/plain' })
    const { error: uploadError } = await supabase.storage
      .from('room-photos')
      .upload('test/test.txt', testFile, { upsert: true })
    
    if (uploadError) {
      console.error('❌ Upload test failed:', uploadError)
      return false
    }
    
    // Test download
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from('room-photos')
      .download('test/test.txt')
    
    if (downloadError) {
      console.error('❌ Download test failed:', downloadError)
      return false
    }
    
    // Test delete
    const { error: deleteError } = await supabase.storage
      .from('room-photos')
      .remove(['test/test.txt'])
    
    if (deleteError) {
      console.error('❌ Delete test failed:', deleteError)
      return false
    }
    
    console.log('✅ Storage functionality test passed')
    return true
    
  } catch (error) {
    console.error('❌ Storage test failed:', error)
    return false
  }
}

/**
 * Get storage statistics
 */
export async function getStorageStats() {
  try {
    const { data: files, error } = await supabase.storage
      .from('room-photos')
      .list()
    
    if (error) {
      console.error('Error getting storage stats:', error)
      return null
    }
    
    const totalSize = files?.reduce((acc, file) => acc + (file.metadata?.size || 0), 0) || 0
    const fileCount = files?.length || 0
    
    return {
      totalSize,
      fileCount,
      averageSize: fileCount > 0 ? totalSize / fileCount : 0,
      totalSizeMB: totalSize / (1024 * 1024)
    }
    
  } catch (error) {
    console.error('Error getting storage stats:', error)
    return null
  }
}

/**
 * Environment configuration check
 */
export function checkEnvironmentConfig() {
  console.log('🔄 Checking environment configuration...')
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar])
  
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars)
    return false
  }
  
  console.log('✅ Environment configuration check passed')
  return true
}

/**
 * Complete setup process
 */
export async function completeSetup() {
  console.log('🚀 Starting complete setup...')
  
  // Check environment
  if (!checkEnvironmentConfig()) {
    return false
  }
  
  // Initialize storage
  const storageInitialized = await initializeStorage()
  if (!storageInitialized) {
    return false
  }
  
  // Create initial folders
  const foldersCreated = await createInitialFolders()
  if (!foldersCreated) {
    return false
  }
  
  // Test storage
  const storageTestPassed = await testStorage()
  if (!storageTestPassed) {
    return false
  }
  
  // Get storage stats
  const stats = await getStorageStats()
  if (stats) {
    console.log('📊 Storage stats:', stats)
  }
  
  console.log('🎉 Setup completed successfully!')
  return true
}

// Usage example:
// import { completeSetup } from '@/lib/init-storage'
// await completeSetup() 