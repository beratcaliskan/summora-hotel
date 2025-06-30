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
          id: string
          created_at: string
          title_tr: string
          title_en: string
          description_tr: string | null
          description_en: string | null
          size: string
          capacity: number
          price: number
          image_url: string
          amenities: string[]
          room_type: 'standard' | 'deluxe' | 'suite' | 'presidential'
        }
        Insert: {
          id?: string
          created_at?: string
          title_tr: string
          title_en: string
          description_tr?: string | null
          description_en?: string | null
          size: string
          capacity: number
          price: number
          image_url: string
          amenities: string[]
          room_type: 'standard' | 'deluxe' | 'suite' | 'presidential'
        }
        Update: {
          id?: string
          created_at?: string
          title_tr?: string
          title_en?: string
          description_tr?: string | null
          description_en?: string | null
          size?: string
          capacity?: number
          price?: number
          image_url?: string
          amenities?: string[]
          room_type?: 'standard' | 'deluxe' | 'suite' | 'presidential'
        }
      }
      reservations: {
        Row: {
          id: string
          created_at: string
          room_id: string
          check_in: string
          check_out: string
          guest_name: string
          guest_email: string
          guest_phone: string
          status: 'pending' | 'confirmed' | 'cancelled'
          total_price: number
        }
        Insert: {
          id?: string
          created_at?: string
          room_id: string
          check_in: string
          check_out: string
          guest_name: string
          guest_email: string
          guest_phone: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          total_price: number
        }
        Update: {
          id?: string
          created_at?: string
          room_id?: string
          check_in?: string
          check_out?: string
          guest_name?: string
          guest_email?: string
          guest_phone?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          total_price?: number
        }
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
  }
} 