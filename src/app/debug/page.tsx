'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RoomPhotoUpload from '@/components/admin/RoomPhotoUpload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { testStorageBucket, debugRoomPhotos } from '@/lib/test-storage'

interface Room {
  id: number
  title: any
  featured_image_url?: string
}

export default function DebugPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [testUrl, setTestUrl] = useState('http://192.168.1.16:8001/storage/v1/object/public/room-photos/1/gallery-1752098692864.png')
  
  useEffect(() => {
    checkConnection()
    fetchRooms()
  }, [])

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from('rooms').select('count').limit(1)
      if (error) {
        setConnectionStatus('error')
        setError(`Supabase connection failed: ${error.message}`)
      } else {
        setConnectionStatus('connected')
      }
    } catch (err) {
      setConnectionStatus('error')
      setError(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const fetchRooms = async () => {
    try {
          const { data, error } = await supabase
      .from('rooms')
      .select('id, title, featured_image_url')
      .order('id')

    if (error) {
      setError(`Failed to fetch rooms: ${error.message}`)
    } else {
      setRooms(data || [])
    }
    } catch (err) {
      setError(`Error fetching rooms: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const createTestRoom = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([
          {
            title: {
              tr: `Test Odası ${Date.now()}`,
              en: `Test Room ${Date.now()}`
            },
            description: {
              tr: 'Bu fotoğraf yüklemesi için test odasıdır',
              en: 'This is a test room for photo uploads'
            },
            size: '25m²',
            capacity: 2,
            price: 100,
            featured_image_url: 'room-photos/test/featured.jpg',
            amenities: ['TV', 'Wi-Fi'],
            room_type: 'standard',
            is_active: true
          }
        ])
        .select()
        .single()

      if (error) {
        setError(`Failed to create test room: ${error.message}`)
      } else {
        setRooms([...rooms, data])
        setSelectedRoomId(data.id)
        setError(null)
      }
    } catch (err) {
      setError(`Error creating test room: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handlePhotosUpdated = () => {
    // Refresh room data after photos are updated
    fetchRooms()
  }

  const runStorageTest = async () => {
    console.log('🧪 Running storage test...')
    await testStorageBucket()
  }

  const runPhotoDebug = async () => {
    if (!selectedRoomId) return
    console.log(`🧪 Running photo debug for room ${selectedRoomId}...`)
    await debugRoomPhotos(selectedRoomId)
  }

  const testPhotoUrl = async () => {
    console.log('🧪 Testing specific photo URL:', testUrl)
    
    try {
      const response = await fetch(testUrl, { method: 'HEAD' })
      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (response.ok) {
        console.log('✅ Photo URL is accessible!')
        setError(null)
      } else {
        console.error('❌ Photo URL failed:', response.status, response.statusText)
        setError(`Photo URL failed: ${response.status} ${response.statusText}`)
      }
    } catch (err) {
      console.error('❌ Network error:', err)
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Room Photo Upload Debug</CardTitle>
          <CardDescription>
            Test the room photo upload functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <span>Supabase Status:</span>
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
              {connectionStatus === 'checking' ? 'Checking...' : 
               connectionStatus === 'connected' ? 'Connected' : 'Error'}
            </Badge>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Room Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Room:</label>
            <div className="flex gap-2">
              <Select 
                value={selectedRoomId?.toString() || ''} 
                onValueChange={(value) => setSelectedRoomId(parseInt(value))}
                disabled={loading}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose a room to test photo upload" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      #{room.id} - {room.title.tr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={createTestRoom} variant="outline">
                Create Test Room
              </Button>
            </div>
          </div>

          {/* Room Info */}
          {selectedRoomId && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h3 className="font-medium text-blue-900">Selected Room Info:</h3>
              <p className="text-sm text-blue-700">
                Room ID: {selectedRoomId} | 
                Name: {rooms.find(r => r.id === selectedRoomId)?.title.tr || 'Unknown'}
              </p>
              {rooms.find(r => r.id === selectedRoomId)?.featured_image_url && (
                <p className="text-sm text-blue-700">
                  Featured Image: ✓ Set
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Upload Component */}
      {selectedRoomId && connectionStatus === 'connected' && (
        <Card>
          <CardHeader>
            <CardTitle>Photo Upload Test</CardTitle>
            <CardDescription>
              Drag and drop photos or click to select files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoomPhotoUpload 
              roomId={selectedRoomId} 
              onPhotoUploaded={handlePhotosUpdated}
            />
          </CardContent>
        </Card>
      )}

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm mb-4">
            <div>Total Rooms: {rooms.length}</div>
            <div>Selected Room ID: {selectedRoomId || 'None'}</div>
            <div>Connection Status: {connectionStatus}</div>
            <div>Loading: {loading ? 'Yes' : 'No'}</div>
            <div>Environment: {process.env.NODE_ENV}</div>
          </div>
          <div className="space-y-2">
            <Button onClick={runStorageTest} variant="outline" className="w-full">
              🧪 Test Storage Bucket
            </Button>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Photo URL:</label>
              <input
                type="url"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter photo URL to test"
              />
              <Button onClick={testPhotoUrl} variant="outline" className="w-full">
                🌐 Test Photo URL Direct
              </Button>
            </div>
            
            {selectedRoomId && (
              <Button onClick={runPhotoDebug} variant="outline" className="w-full">
                🔍 Debug Room Photos
              </Button>
            )}
            <p className="text-xs text-gray-500">
              Check browser console for detailed test results
            </p>
            
            {/* Direct URL Test Preview */}
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="text-sm font-medium mb-2">Direct URL Test Preview:</h4>
              <div className="aspect-square max-w-xs bg-white border rounded-lg overflow-hidden">
                <img
                  src={testUrl}
                  alt="URL Test"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('❌ Direct URL test failed:', testUrl)
                    e.currentTarget.style.display = 'none'
                    const errorDiv = document.createElement('div')
                    errorDiv.className = 'w-full h-full flex items-center justify-center bg-red-50 text-red-600 text-sm'
                    errorDiv.innerHTML = '<div class="text-center"><div>❌ Failed to load</div><div class="text-xs mt-1">Direct URL Test</div></div>'
                    e.currentTarget.parentElement?.appendChild(errorDiv)
                  }}
                  onLoad={() => {
                    console.log('✅ Direct URL test successful:', testUrl)
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                If image loads here, storage is working correctly
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 