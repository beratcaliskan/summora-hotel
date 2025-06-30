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
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-4">{t.ourRooms}</h1>
      <p className="text-lg text-center text-gray-600 mb-12">{t.ourRoomsDesc}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={room.image}
                alt={t[`${room.id}Room` as keyof typeof t]}
                className="object-cover w-full h-full"
              />
              <Badge className="absolute top-4 right-4 bg-orange-500">
                {room.price}₺ / {t.night}
              </Badge>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-2">
                {t[`${room.id}Room` as keyof typeof t]}
              </h3>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <span>{room.size}</span>
                <span>•</span>
                <span>{room.capacity} {t.guests}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {room.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                {t.makeReservation}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 