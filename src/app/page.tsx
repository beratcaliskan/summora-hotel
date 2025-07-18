"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  CalendarIcon,
  Users,
  Phone,
  Mail,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Dumbbell,
  SpadeIcon as Spa,
  Facebook,
  Instagram,
  Twitter,
  Clock,
  Award,
  Heart,
} from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { useLanguage } from "@/hooks/useLanguage"
import { LanguageSelector } from "@/components/language-selector"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type Room = Database['public']['Tables']['rooms']['Row']

export default function Component() {
  const { t, currentLanguage } = useLanguage()
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomsLoading, setRoomsLoading] = useState(true)

  useEffect(() => {
    async function fetchRooms() {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('is_active', true)
          .order('price', { ascending: true })
          .limit(4)

        if (error) {
          console.error('Error fetching rooms:', error)
        } else {
          setRooms(data || [])
        }
      } catch (error) {
        console.error('Error fetching rooms:', error)
      } finally {
        setRoomsLoading(false)
      }
    }

    fetchRooms()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white py-32 min-h-screen">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6">{t.heroTitle}</h1>
            <p className="text-2xl text-orange-100 mb-4">{t.heroSubtitle}</p>
            <p className="text-lg text-orange-200 max-w-2xl mx-auto">{t.heroDescription}</p>
          </div>

          {/* Reservation Form */}
          <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t.makeReservation}</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t.checkIn}</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-orange-200 hover:border-orange-500 bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-orange-500" />
                        {checkIn ? format(checkIn, "dd MMM yyyy", { locale: tr }) : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t.checkOut}</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-orange-200 hover:border-orange-500 bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-orange-500" />
                        {checkOut ? format(checkOut, "dd MMM yyyy", { locale: tr }) : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t.guests}</label>
                  <Select>
                    <SelectTrigger className="border-orange-200 focus:border-orange-500">
                      <Users className="mr-2 h-4 w-4 text-orange-500" />
                      <SelectValue placeholder={t.guests} />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t.roomType}</label>
                  <Select>
                    <SelectTrigger className="border-orange-200 focus:border-orange-500">
                      <SelectValue placeholder={t.roomType} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">{t.standardRoom}</SelectItem>
                      <SelectItem value="deluxe">{t.deluxeRoom}</SelectItem>
                      <SelectItem value="suite">{t.suiteRoom}</SelectItem>
                      <SelectItem value="presidential">{t.presidentialSuite}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t.fullName}</label>
                  <Input
                    placeholder={t.fullName}
                    className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t.phone}</label>
                  <Input
                    placeholder={t.phone}
                    className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t.email}</label>
                <Input
                  type="email"
                  placeholder={t.email}
                  className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t.specialRequests}</label>
                <Textarea
                  placeholder={t.specialRequests}
                  rows={4}
                  className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-4 text-lg font-semibold">
                {t.makeReservationBtn}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Room Types */}
      <section id="rooms" className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t.ourRooms}</h2>
            <p className="text-xl text-gray-600">{t.ourRoomsDesc}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {roomsLoading ? (
              // Loading skeleton
              <>
                {[1, 2, 3, 4].map((index) => (
                  <Card key={index} className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                    <div className="relative">
                      <div className="w-full h-72 bg-gray-200 animate-pulse"></div>
                    </div>
                    <CardContent className="p-8">
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-6"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              // Dynamic rooms
              rooms.map((room, index) => {
                const getBadgeConfig = (roomType: string, index: number) => {
                  switch (roomType) {
                    case 'standard':
                      return { text: t.popular, bgColor: 'bg-orange-600 hover:bg-orange-700' }
                    case 'deluxe':
                      return { text: t.recommended, bgColor: 'bg-blue-600 hover:bg-blue-700' }
                    case 'suite':
                      return { text: t.luxury, bgColor: 'bg-purple-600 hover:bg-purple-700' }
                    case 'presidential':
                      return { text: 'VIP', bgColor: 'bg-yellow-600 hover:bg-yellow-700' }
                    default:
                      return { text: t.popular, bgColor: 'bg-orange-600 hover:bg-orange-700' }
                  }
                }

                const badgeConfig = getBadgeConfig(room.room_type, index)
                
                return (
                  <Card key={room.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                    <div className="relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/room-photos/${room.featured_image_url}`}
                        alt={(room.title as any)?.[currentLanguage] || 'Room'}
                        width={500}
                        height={300}
                        className="w-full h-72 object-cover"
                        onError={(e) => {
                          console.error('❌ Featured image failed to load:', room.featured_image_url)
                          e.currentTarget.src = '/placeholder.svg?height=300&width=500'
                        }}
                        onLoad={() => {
                          console.log('✅ Featured image loaded:', room.featured_image_url)
                        }}
                      />
                      <Badge className={`absolute top-4 left-4 ${badgeConfig.bgColor}`}>
                        {badgeConfig.text}
                      </Badge>
                    </div>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        {(room.title as any)?.[currentLanguage] || 'Room'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {(room.description as any)?.[currentLanguage] || ''}
                      </p>
                      <div className="flex items-center space-x-4 mb-6">
                        <Wifi className="h-5 w-5 text-orange-500" />
                        <Coffee className="h-5 w-5 text-orange-500" />
                        {room.room_type !== 'standard' && <Spa className="h-5 w-5 text-orange-500" />}
                        {(room.room_type === 'suite' || room.room_type === 'presidential') && <Utensils className="h-5 w-5 text-orange-500" />}
                        {room.room_type === 'presidential' && <Car className="h-5 w-5 text-orange-500" />}
                        <span className="text-sm text-gray-600">
                          {room.amenities.slice(0, 3).join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-3xl font-bold text-orange-600">₺{room.price}</span>
                          <span className="text-gray-500 ml-1">/{t.night}</span>
                        </div>
                        <Button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                          {t.makeReservation}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.ourServices}</h2>
            <p className="text-xl text-orange-100">{t.ourServicesDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.restaurant}</h3>
              <p className="text-orange-100">{t.restaurantDesc}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Spa className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.spa}</h3>
              <p className="text-orange-100">{t.spaDesc}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.fitness}</h3>
              <p className="text-orange-100">{t.fitnessDesc}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.valet}</h3>
              <p className="text-orange-100">{t.valetDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Summora */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t.whyLunara}</h2>
            <p className="text-xl text-gray-600">{t.whyLunaraDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t.awardService}</h3>
              <p className="text-gray-600">{t.awardServiceDesc}</p>
            </Card>
            <Card className="text-center p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t.concierge}</h3>
              <p className="text-gray-600">{t.conciergeDesc}</p>
            </Card>
            <Card className="text-center p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t.personalTouch}</h3>
              <p className="text-gray-600">{t.personalTouchDesc}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.contactTitle}</h2>
            <p className="text-xl text-gray-300">{t.contactDesc}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-orange-400">Summora Boutique Hotel</h3>
              <div className="space-y-4">
                <p className="flex items-center text-gray-300">
                  <MapPin className="h-5 w-5 mr-3 text-orange-400" />
                  Beyoğlu, İstiklal Caddesi No:123, İstanbul
                </p>
                <p className="flex items-center text-gray-300">
                  <Phone className="h-5 w-5 mr-3 text-orange-400" />
                  +90 212 555 0123
                </p>
                <p className="flex items-center text-gray-300">
                  <Mail className="h-5 w-5 mr-3 text-orange-400" />
                  info@summora.com
                </p>
              </div>
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-orange-400">{t.followUs}</h4>
                <div className="flex space-x-4">
                  <Facebook className="h-8 w-8 text-gray-300 hover:text-orange-400 cursor-pointer transition-colors" />
                  <Instagram className="h-8 w-8 text-gray-300 hover:text-orange-400 cursor-pointer transition-colors" />
                  <Twitter className="h-8 w-8 text-gray-300 hover:text-orange-400 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-white">{t.sendMessage}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder={t.firstName}
                      className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder={t.lastName}
                      className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder={t.email}
                    className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <Input
                    placeholder={t.phone}
                    className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <Textarea
                    placeholder={t.yourMessage}
                    rows={4}
                    className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                    {t.sendBtn}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}

    </div>
  )
}
