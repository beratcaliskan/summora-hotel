"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type Room = Database['public']['Tables']['rooms']['Row']

export default function RoomsPage() {
  const { t, currentLanguage } = useLanguage()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRooms() {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .order('price', { ascending: true })

        if (error) {
          throw error
        }

        if (data) {
          setRooms(data)
        }
      } catch (error) {
        console.error('Error fetching rooms:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-orange-100">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-orange-950 mb-4">{t.ourRooms}</h1>
          <p className="text-xl text-orange-800 max-w-2xl mx-auto opacity-90">{t.ourRoomsDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <Card key={room.id} className="bg-white/80 backdrop-blur-sm overflow-hidden hover:scale-[1.02] transition-transform duration-300 border-orange-200 shadow-lg hover:shadow-xl">
              <div className="aspect-video relative">
                <img
                  src={room.image_url}
                  alt={room[`title_${currentLanguage}` as keyof Room]}
                  className="object-cover w-full h-full"
                />
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-amber-400 text-white border-none shadow-md">
                  {room.price}₺ / {t.night}
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-orange-950">
                  {room[`title_${currentLanguage}` as keyof Room]}
                </h3>
                {room[`description_${currentLanguage}` as keyof Room] && (
                  <p className="text-orange-700 mb-4">
                    {room[`description_${currentLanguage}` as keyof Room]}
                  </p>
                )}
                <div className="flex items-center gap-4 text-orange-700 mb-4">
                  <span>{room.size}</span>
                  <span>•</span>
                  <span>{room.capacity} {t.guests}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white border-none shadow-md">
                  {t.makeReservation}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
} 