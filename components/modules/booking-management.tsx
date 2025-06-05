"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, User, Calendar, CreditCard, MapPin, Armchair } from "lucide-react"

interface Booking {
  id: string
  bookingRef: string
  passengerName: string
  passengerPhone: string
  passengerEmail: string
  routeName: string
  scheduleId: string
  date: string
  departureTime: string
  seatNumber: string
  fare: number
  paymentStatus: "paid" | "pending" | "failed"
  bookingStatus: "confirmed" | "cancelled" | "completed"
  bookingDate: string
}

const mockBookings: Booking[] = [
  {
    id: "BK001",
    bookingRef: "STC-BK-001234",
    passengerName: "Alice Johnson",
    passengerPhone: "+233 24 777 8888",
    passengerEmail: "alice.johnson@email.com",
    routeName: "Accra - Kumasi Express",
    scheduleId: "SCH001",
    date: "2024-03-15",
    departureTime: "08:00",
    seatNumber: "12A",
    fare: 45.0,
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    bookingDate: "2024-03-10",
  },
  {
    id: "BK002",
    bookingRef: "STC-BK-001235",
    passengerName: "Robert Kwame",
    passengerPhone: "+233 20 999 0000",
    passengerEmail: "robert.kwame@email.com",
    routeName: "Accra - Takoradi Coastal",
    scheduleId: "SCH002",
    date: "2024-03-15",
    departureTime: "10:00",
    seatNumber: "8B",
    fare: 35.0,
    paymentStatus: "pending",
    bookingStatus: "confirmed",
    bookingDate: "2024-03-12",
  },
]

export function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSeatDialogOpen, setIsSeatDialogOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.passengerPhone.includes(searchTerm),
  )

  const handleAddBooking = () => {
    setEditingBooking(null)
    setIsDialogOpen(true)
  }

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking)
    setIsDialogOpen(true)
  }

  const handleDeleteBooking = (bookingId: string) => {
    setBookings(bookings.filter((booking) => booking.id !== bookingId))
  }

  const handleSeatSelection = () => {
    setIsSeatDialogOpen(true)
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderSeatMap = () => {
    const totalSeats = 32
    const rows = 8
    const seatsPerRow = 4
    const bookedSeats = ["1A", "1B", "3C", "5A", "7D", "8B"]
    const blockedSeats = ["2A", "2B"]

    return (
      <div className="space-y-2">
        <div className="text-center text-sm font-medium text-gray-600 mb-4">Driver</div>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-2">
            {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
              const seatNumber = `${rowIndex + 1}${String.fromCharCode(65 + seatIndex)}`
              const isBooked = bookedSeats.includes(seatNumber)
              const isBlocked = blockedSeats.includes(seatNumber)
              const isSelected = selectedSeats.includes(seatNumber)

              let seatClass =
                "w-10 h-10 border rounded flex items-center justify-center text-xs font-medium cursor-pointer "

              if (isBlocked) {
                seatClass += "bg-gray-300 border-gray-400 text-gray-600 cursor-not-allowed"
              } else if (isBooked) {
                seatClass += "bg-red-100 border-red-300 text-red-600 cursor-not-allowed"
              } else if (isSelected) {
                seatClass += "bg-green-500 border-green-600 text-white"
              } else {
                seatClass += "bg-green-100 border-green-300 text-green-600 hover:bg-green-200"
              }

              return (
                <div
                  key={seatIndex}
                  className={seatClass}
                  onClick={() => {
                    if (!isBooked && !isBlocked) {
                      setSelectedSeats((prev) =>
                        prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber],
                      )
                    }
                  }}
                >
                  {seatNumber}
                </div>
              )
            })}
          </div>
        ))}

        <div className="flex justify-center space-x-6 mt-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-300 border border-gray-400 rounded"></div>
            <span>Blocked</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-green-500 border border-green-600 rounded"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-2">Manage passenger bookings and seat reservations</p>
        </div>
        <Button onClick={handleAddBooking}>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by booking reference, passenger name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{booking.bookingRef}</CardTitle>
                  <CardDescription>{booking.passengerName}</CardDescription>
                </div>
                <div className="flex flex-col space-y-1">
                  <Badge className={getBookingStatusColor(booking.bookingStatus)}>{booking.bookingStatus}</Badge>
                  <Badge className={getPaymentStatusColor(booking.paymentStatus)}>{booking.paymentStatus}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{booking.passengerPhone}</span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{booking.routeName}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {booking.date} at {booking.departureTime}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Armchair className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Seat {booking.seatNumber}</span>
              </div>

              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">GH₵ {booking.fare.toFixed(2)}</span>
              </div>

              <div className="text-sm text-gray-600">
                <p>Booked: {booking.bookingDate}</p>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => handleEditBooking(booking)} className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteBooking(booking.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBooking ? "Edit Booking" : "New Booking"}</DialogTitle>
            <DialogDescription>
              {editingBooking ? "Update booking information" : "Create a new passenger booking"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passengerName">Passenger Name</Label>
              <Input
                id="passengerName"
                placeholder="e.g., Alice Johnson"
                defaultValue={editingBooking?.passengerName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengerPhone">Phone Number</Label>
              <Input id="passengerPhone" placeholder="+233 24 777 8888" defaultValue={editingBooking?.passengerPhone} />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="passengerEmail">Email Address</Label>
              <Input
                id="passengerEmail"
                type="email"
                placeholder="alice.johnson@email.com"
                defaultValue={editingBooking?.passengerEmail}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="route">Route</Label>
              <Select defaultValue={editingBooking?.routeName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accra - Kumasi Express">Accra - Kumasi Express</SelectItem>
                  <SelectItem value="Accra - Takoradi Coastal">Accra - Takoradi Coastal</SelectItem>
                  <SelectItem value="Kumasi - Tamale Northern">Kumasi - Tamale Northern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Select defaultValue={editingBooking?.scheduleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCH001">2024-03-15 08:00</SelectItem>
                  <SelectItem value="SCH002">2024-03-15 10:00</SelectItem>
                  <SelectItem value="SCH003">2024-03-15 14:00</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seatNumber">Seat Number</Label>
              <div className="flex space-x-2">
                <Input
                  id="seatNumber"
                  placeholder="e.g., 12A"
                  defaultValue={editingBooking?.seatNumber}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleSeatSelection}>
                  Select Seat
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fare">Fare (GH₵)</Label>
              <Input id="fare" type="number" step="0.01" placeholder="45.00" defaultValue={editingBooking?.fare} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select defaultValue={editingBooking?.paymentStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookingStatus">Booking Status</Label>
              <Select defaultValue={editingBooking?.bookingStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select booking status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>
              {editingBooking ? "Update Booking" : "Create Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Seat Selection Dialog */}
      <Dialog open={isSeatDialogOpen} onOpenChange={setIsSeatDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Seats</DialogTitle>
            <DialogDescription>Choose available seats for the passenger</DialogDescription>
          </DialogHeader>

          <div className="py-4">{renderSeatMap()}</div>

          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-600">Selected: {selectedSeats.join(", ") || "None"}</div>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsSeatDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsSeatDialogOpen(false)}>Confirm Selection</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
