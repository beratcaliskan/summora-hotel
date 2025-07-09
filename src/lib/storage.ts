import { supabase } from './supabase'

// Storage bucket configuration
const BUCKET_NAME = 'room-photos'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_PHOTOS_PER_ROOM = 20

export interface PhotoUploadOptions {
  roomId: number
  file: File
  isFeatured?: boolean
  displayOrder?: number
}

export interface PhotoUploadResult {
  success: boolean
  data?: {
    id: number
    url: string
    path: string
  }
  error?: string
}

export class RoomPhotoManager {
  
  // Initialize storage bucket
  static async initializeBucket() {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets()
      const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)
      
      if (!bucketExists) {
        // Create bucket
        const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true, // Public bucket for self-hosted Supabase
          fileSizeLimit: MAX_FILE_SIZE,
          allowedMimeTypes: ALLOWED_FILE_TYPES
        })
        
        if (error) {
          console.error('Error creating bucket:', error)
          return false
        }
        
        console.log('Storage bucket created successfully')
      }
      
      return true
    } catch (error) {
      console.error('Error initializing bucket:', error)
      return false
    }
  }
  
  // Validate file before upload
  static validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 5MB limit' }
    }
    
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' }
    }
    
    return { valid: true }
  }
  
  // Upload featured photo (vitrin fotoğrafı)
  static async uploadFeaturedPhoto(roomId: number, file: File): Promise<PhotoUploadResult> {
    const validation = this.validateFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }
    
    try {
      const fileName = `featured.${file.name.split('.').pop()}`
      const filePath = `${roomId}/${fileName}`
      
      // Delete existing featured photo if exists
      await supabase.storage.from(BUCKET_NAME).remove([`${roomId}/featured.jpg`, `${roomId}/featured.png`, `${roomId}/featured.webp`])
      
      // Upload new featured photo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600'
        })
      
      if (uploadError) {
        return { success: false, error: uploadError.message }
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath)
      
      // Update room's featured_image_url
      const { error: updateError } = await supabase
        .from('rooms')
        .update({ featured_image_url: filePath })
        .eq('id', roomId)
      
      if (updateError) {
        return { success: false, error: updateError.message }
      }
      
      return {
        success: true,
        data: {
          id: roomId,
          url: publicUrl,
          path: filePath
        }
      }
    } catch (error) {
      return { success: false, error: 'Failed to upload featured photo' }
    }
  }
  
  // Upload gallery photo
  static async uploadGalleryPhoto(options: PhotoUploadOptions): Promise<PhotoUploadResult> {
    const { roomId, file, displayOrder = 0 } = options
    
    const validation = this.validateFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }
    
    try {
      // Check photo count limit
      const { count, error: countError } = await supabase
        .from('room_photos')
        .select('id', { count: 'exact', head: true })
        .eq('room_id', roomId)
      
      if (countError) {
        return { success: false, error: countError.message }
      }
      
      if (count && count >= MAX_PHOTOS_PER_ROOM) {
        return { success: false, error: `Maximum ${MAX_PHOTOS_PER_ROOM} photos allowed per room` }
      }
      
      // Generate unique filename
      const timestamp = Date.now()
      const fileName = `gallery-${timestamp}.${file.name.split('.').pop()}`
      const filePath = `${roomId}/${fileName}`
      
      // Upload photo to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600'
        })
      
      if (uploadError) {
        return { success: false, error: uploadError.message }
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath)
      
      // Insert photo record to database
      const { data: photoData, error: insertError } = await supabase
        .from('room_photos')
        .insert({
          room_id: roomId,
          image_url: filePath,
          image_name: file.name,
          image_size: file.size,
          display_order: displayOrder
        })
        .select()
        .single()
      
      if (insertError) {
        // Delete uploaded file if database insert fails
        await supabase.storage.from(BUCKET_NAME).remove([filePath])
        return { success: false, error: insertError.message }
      }
      
      // If this is the first photo for this room, also set it as featured
      const { count: totalPhotos } = await supabase
        .from('room_photos')
        .select('id', { count: 'exact', head: true })
        .eq('room_id', roomId)
      
      if (totalPhotos === 1) {
        console.log('🎯 Setting first uploaded photo as featured photo for room', roomId)
        await supabase
          .from('rooms')
          .update({ featured_image_url: filePath })
          .eq('id', roomId)
      }

      return {
        success: true,
        data: {
          id: photoData.id,
          url: publicUrl,
          path: filePath
        }
      }
    } catch (error) {
      return { success: false, error: 'Failed to upload gallery photo' }
    }
  }
  
  // Delete photo
  static async deletePhoto(photoId: number): Promise<{ success: boolean; error?: string }> {
    try {
      // Get photo info
      const { data: photo, error: fetchError } = await supabase
        .from('room_photos')
        .select('image_url')
        .eq('id', photoId)
        .single()
      
      if (fetchError || !photo) {
        return { success: false, error: 'Photo not found' }
      }
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([photo.image_url])
      
      if (storageError) {
        return { success: false, error: storageError.message }
      }
      
      // Delete from database
      const { error: deleteError } = await supabase
        .from('room_photos')
        .delete()
        .eq('id', photoId)
      
      if (deleteError) {
        return { success: false, error: deleteError.message }
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete photo' }
    }
  }
  
  // Get room photos
  static async getRoomPhotos(roomId: number) {
    try {
      const { data: photos, error } = await supabase
        .from('room_photos')
        .select('*')
        .eq('room_id', roomId)
        .order('display_order', { ascending: true })
      
      if (error) {
        throw error
      }
      
      // Get public URLs for all photos
      const photosWithUrls = await Promise.all(
        photos.map(async (photo) => {
          const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(photo.image_url)
          
          console.log('🔗 Generated public URL for photo:', photo.image_url, '→', publicUrl)
          console.log('🔗 Expected format:', `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/room-photos/...`)
          
          // Ensure URL is properly formatted for self-hosted
          let correctedUrl = publicUrl
          const expectedBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
          if (!publicUrl.includes(expectedBaseUrl || '')) {
            correctedUrl = `${expectedBaseUrl}/storage/v1/object/public/room-photos/${photo.image_url}`
            console.log('🔧 URL corrected to:', correctedUrl)
          }
          
          return {
            ...photo,
            public_url: correctedUrl
          }
        })
      )
      
      return photosWithUrls
    } catch (error) {
      console.error('Error getting room photos:', error)
      return []
    }
  }
  
  // Get room featured photo
  static async getRoomFeaturedPhoto(roomId: number) {
    try {
      const { data: room, error } = await supabase
        .from('rooms')
        .select('featured_image_url')
        .eq('id', roomId)
        .single()
      
      if (error || !room) {
        return null
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(room.featured_image_url)
      
      console.log('Generated featured photo URL:', room.featured_image_url, '→', publicUrl)
      
      return publicUrl
    } catch (error) {
      console.error('Error getting featured photo:', error)
      return null
    }
  }
  
  // Update photo display order
  static async updatePhotoOrder(photoId: number, newOrder: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('room_photos')
        .update({ display_order: newOrder })
        .eq('id', photoId)
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to update photo order' }
    }
  }
  
  // Get storage usage stats
  static async getStorageStats() {
    try {
      const { data: photos, error } = await supabase
        .from('room_photos')
        .select('image_size')
      
      if (error) {
        throw error
      }
      
      const totalSize = photos.reduce((acc, photo) => acc + (photo.image_size || 0), 0)
      const photoCount = photos.length
      
      return {
        totalSize,
        photoCount,
        averageSize: photoCount > 0 ? totalSize / photoCount : 0
      }
    } catch (error) {
      console.error('Error getting storage stats:', error)
      return { totalSize: 0, photoCount: 0, averageSize: 0 }
    }
  }
}

// Helper function to initialize storage on app start
export async function initializeRoomStorage() {
  return await RoomPhotoManager.initializeBucket()
} 