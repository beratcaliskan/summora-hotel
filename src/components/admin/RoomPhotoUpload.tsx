'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { RoomPhotoManager, PhotoUploadResult } from '@/lib/storage'
import { RoomPhotoWithUrl } from '@/types/supabase'

interface RoomPhotoUploadProps {
  roomId: number
  onPhotoUploaded?: (result: PhotoUploadResult) => void
  onPhotoDeleted?: (photoId: number) => void
  initialPhotos?: RoomPhotoWithUrl[]
}

export default function RoomPhotoUpload({ 
  roomId, 
  onPhotoUploaded, 
  onPhotoDeleted,
  initialPhotos = []
}: RoomPhotoUploadProps) {
  const [photos, setPhotos] = useState<RoomPhotoWithUrl[]>(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load photos on component mount
  const loadPhotos = useCallback(async () => {
    try {
      const roomPhotos = await RoomPhotoManager.getRoomPhotos(roomId)
      console.log('Loaded photos:', roomPhotos)
      setPhotos(roomPhotos)
    } catch (error) {
      console.error('Error loading photos:', error)
    }
  }, [roomId])

  // Load photos when component mounts or roomId changes
  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    
    const fileArray = Array.from(files)
    uploadFiles(fileArray)
  }

  // Upload multiple files
  const uploadFiles = async (files: File[]) => {
    setUploading(true)
    setErrors([])
    
    const results = []
    
    for (const file of files) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
        
        // Simulate progress for demo (real implementation would use proper progress tracking)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[file.name] || 0
            if (current < 90) {
              return { ...prev, [file.name]: current + 10 }
            }
            return prev
          })
        }, 100)

        const result = await RoomPhotoManager.uploadGalleryPhoto({
          roomId,
          file,
          displayOrder: photos.length + results.length
        })
        
        clearInterval(progressInterval)
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
        
        if (result.success) {
          results.push(result)
          onPhotoUploaded?.(result)
        } else {
          setErrors(prev => [...prev, `${file.name}: ${result.error}`])
        }
      } catch (error) {
        setErrors(prev => [...prev, `${file.name}: Upload failed`])
      }
    }
    
    // Refresh photos list
    await loadPhotos()
    setUploading(false)
    setUploadProgress({})
  }

  // Upload featured photo
  const uploadFeaturedPhoto = async (file: File) => {
    setUploading(true)
    
    try {
      const result = await RoomPhotoManager.uploadFeaturedPhoto(roomId, file)
      
      if (result.success) {
        onPhotoUploaded?.(result)
        // Refresh photos list
        await loadPhotos()
      } else {
        setErrors([result.error || 'Failed to upload featured photo'])
      }
    } catch (error) {
      setErrors(['Failed to upload featured photo'])
    }
    
    setUploading(false)
  }

  // Delete photo
  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return
    
    try {
      const result = await RoomPhotoManager.deletePhoto(photoId)
      
      if (result.success) {
        setPhotos(prev => prev.filter(photo => photo.id !== photoId))
        onPhotoDeleted?.(photoId)
      } else {
        setErrors([result.error || 'Failed to delete photo'])
      }
    } catch (error) {
      setErrors(['Failed to delete photo'])
    }
  }

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  // Update photo order
  const updatePhotoOrder = async (photoId: number, newOrder: number) => {
    try {
      const result = await RoomPhotoManager.updatePhotoOrder(photoId, newOrder)
      
      if (result.success) {
        await loadPhotos()
      } else {
        setErrors([result.error || 'Failed to update photo order'])
      }
    } catch (error) {
      setErrors(['Failed to update photo order'])
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Room Photo Management</h2>
      
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <ul className="list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Area */}
      <div className="mb-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="text-4xl text-gray-400">📸</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drop photos here or click to select
              </p>
              <p className="text-sm text-gray-500">
                Maximum {20 - photos.length} photos (5MB each, JPEG/PNG/WebP)
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || photos.length >= 20}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {uploading ? 'Uploading...' : 'Select Photos'}
            </button>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Upload Progress</h3>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="mb-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{fileName}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Featured Photo Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Featured Photo (Vitrin)</h3>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) uploadFeaturedPhoto(file)
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      {/* Photo Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Gallery Photos ({photos.length}/20)</h3>
        {photos.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            No photos uploaded yet. Upload some photos to see them here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <div key={photo.id} className="relative group border rounded-lg p-3 bg-white shadow-sm">
                {/* Debug Info */}
                <div className="mb-2 text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono">
                  <div><strong>ID:</strong> {photo.id}</div>
                  <div><strong>Path:</strong> {photo.image_url}</div>
                  <div><strong>URL:</strong> {photo.public_url}</div>
                </div>
                
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                  <img
                    src={photo.public_url}
                    alt={photo.image_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('❌ Image load error:', photo.public_url, e)
                      const target = e.currentTarget
                      target.style.display = 'none'
                      // Create error placeholder
                      const errorDiv = document.createElement('div')
                      errorDiv.className = 'absolute inset-0 flex items-center justify-center bg-red-50 text-red-600 text-sm'
                      errorDiv.innerHTML = `
                        <div class="text-center">
                          <div>❌ Failed to load</div>
                          <div class="text-xs mt-1">${photo.image_name}</div>
                        </div>
                      `
                      target.parentElement?.appendChild(errorDiv)
                    }}
                    onLoad={(e) => {
                      console.log('✅ Image loaded successfully:', photo.public_url)
                      // Hide loading placeholder when image loads
                      const loading = e.currentTarget.parentElement?.querySelector('.loading-placeholder')
                      if (loading) loading.remove()
                    }}
                  />
                  {/* Loading placeholder */}
                  <div className="loading-placeholder absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                    Loading...
                  </div>
                  
                  {/* Photo Controls */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                      <button
                        onClick={() => updatePhotoOrder(photo.id, index - 1)}
                        disabled={index === 0}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 disabled:opacity-50"
                        title="Move Up"
                      >
                        ⬆️
                      </button>
                      <button
                        onClick={() => updatePhotoOrder(photo.id, index + 1)}
                        disabled={index === photos.length - 1}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 disabled:opacity-50"
                        title="Move Down"
                      >
                        ⬇️
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Photo Info */}
                <div className="mt-2 text-sm text-gray-600">
                  <p className="truncate font-medium">{photo.image_name}</p>
                  <p>Order: {photo.display_order}</p>
                  <p>{photo.image_size ? `${(photo.image_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
} 