"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const rooms = [
  {
    id: "standard",
    image: "/rooms/standard.jpg",
    size: "25m²",
    capacity: "2",
    price: "1500",
    amenities: ["TV", "Wi-Fi", "Minibar", "Safe"]
  },
  {
    id: "deluxe",
    image: "/rooms/deluxe.jpg",
    size: "35m²",
    capacity: "2",
    price: "2500",
    amenities: ["TV", "Wi-Fi", "Minibar", "Safe", "Balcony", "City View"]
  },
  {
    id: "suite",
    image: "/rooms/suite.jpg",
    size: "50m²",
    capacity: "3",
    price: "3500",
    amenities: ["TV", "Wi-Fi", "Minibar", "Safe", "Balcony", "Sea View", "Living Room"]
  },
  {
    id: "presidential",
    image: "/rooms/presidential.jpg",
    size: "100m²",
    capacity: "4",
    price: "5000",
    amenities: ["TV", "Wi-Fi", "Minibar", "Safe", "Balcony", "Sea View", "Living Room", "Kitchen", "Private Pool"]
  }
]

export default function RoomsPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-orange-950">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">{t.ourRooms}</h1>
          <p className="text-xl text-orange-200 max-w-2xl mx-auto">{t.ourRoomsDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <Card key={room.id} className="bg-black/40 border-orange-500/20 backdrop-blur-sm overflow-hidden hover:scale-[1.02] transition-transform duration-300">
              <div className="aspect-video relative">
                <img
                  src={room.image}
                  alt={t[`${room.id}Room` as keyof typeof t]}
                  className="object-cover w-full h-full"
                />
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-none">
                  {room.price}₺ / {t.night}
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-white">
                  {t[`${room.id}Room` as keyof typeof t]}
                </h3>
                <div className="flex items-center gap-4 text-orange-200 mb-4">
                  <span>{room.size}</span>
                  <span>•</span>
                  <span>{room.capacity} {t.guests}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="border-orange-500/50 text-orange-200">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-none">
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