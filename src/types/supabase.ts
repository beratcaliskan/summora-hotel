export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: number
          created_at: string
          title: Json
          description: Json | null
          size: string
          capacity: number
          price: number
          featured_image_url: string
          amenities: string[]
          room_type: 'standard' | 'deluxe' | 'suite' | 'presidential'
          is_active: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          title: Json
          description?: Json | null
          size: string
          capacity: number
          price: number
          featured_image_url: string
          amenities: string[]
          room_type: 'standard' | 'deluxe' | 'suite' | 'presidential'
          is_active?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          title?: Json
          description?: Json | null
          size?: string
          capacity?: number
          price?: number
          featured_image_url?: string
          amenities?: string[]
          room_type?: 'standard' | 'deluxe' | 'suite' | 'presidential'
          is_active?: boolean
        }
        Relationships: []
      }
      room_photos: {
        Row: {
          id: number
          room_id: number
          image_url: string
          image_name: string
          image_size: number | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: number
          room_id: number
          image_url: string
          image_name: string
          image_size?: number | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: number
          room_id?: number
          image_url?: string
          image_name?: string
          image_size?: number | null
          display_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_photos_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          }
        ]
      }
      reservations: {
        Row: {
          id: number
          created_at: string
          room_id: number
          check_in: string
          check_out: string
          guest_name: string
          guest_email: string
          guest_phone: string
          status: 'pending' | 'confirmed' | 'cancelled'
          total_price: number
          notes: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          room_id: number
          check_in: string
          check_out: string
          guest_name: string
          guest_email: string
          guest_phone: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          total_price: number
          notes?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          room_id?: number
          check_in?: string
          check_out?: string
          guest_name?: string
          guest_email?: string
          guest_phone?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          total_price?: number
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Room = Database['public']['Tables']['rooms']['Row']
export type RoomInsert = Database['public']['Tables']['rooms']['Insert']
export type RoomUpdate = Database['public']['Tables']['rooms']['Update']

export type RoomPhoto = Database['public']['Tables']['room_photos']['Row']
export type RoomPhotoInsert = Database['public']['Tables']['room_photos']['Insert']
export type RoomPhotoUpdate = Database['public']['Tables']['room_photos']['Update']

export type Reservation = Database['public']['Tables']['reservations']['Row']
export type ReservationInsert = Database['public']['Tables']['reservations']['Insert']
export type ReservationUpdate = Database['public']['Tables']['reservations']['Update']

// Extended types with joined data
export type RoomWithPhotos = Room & {
  photos: RoomPhoto[]
  featured_photo_url?: string
}

export type RoomPhotoWithUrl = RoomPhoto & {
  public_url: string
}

// Language-specific types
export type RoomTitle = {
  tr: string
  en: string
}

export type RoomDescription = {
  tr: string
  en: string
}

// API response types
export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

export type RoomListResponse = ApiResponse<RoomWithPhotos[]>
export type RoomDetailResponse = ApiResponse<RoomWithPhotos>
export type PhotoUploadResponse = ApiResponse<{
  id: number
  url: string
  path: string
}>

// Form types
export type RoomFormData = {
  title: RoomTitle
  description: RoomDescription
  size: string
  capacity: number
  price: number
  amenities: string[]
  room_type: Room['room_type']
  is_active: boolean
}

export type ReservationFormData = {
  room_id: number
  check_in: string
  check_out: string
  guest_name: string
  guest_email: string
  guest_phone: string
  notes?: string
}

// Filter types
export type RoomFilters = {
  room_type?: Room['room_type']
  min_price?: number
  max_price?: number
  min_capacity?: number
  max_capacity?: number
  amenities?: string[]
  is_active?: boolean
}

export type ReservationFilters = {
  status?: Reservation['status']
  room_id?: number
  date_from?: string
  date_to?: string
  guest_name?: string
}

// Storage types
export type StorageFile = {
  name: string
  size: number
  type: string
  url: string
}

export type StorageStats = {
  totalSize: number
  photoCount: number
  averageSize: number
} 