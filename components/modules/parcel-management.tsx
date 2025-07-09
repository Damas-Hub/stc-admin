"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Package, MapPin, Weight, Truck } from "lucide-react"
// Remove Tabs import and usage for status filter
// Use Select for status filter

interface Parcel {
  id: string
  trackingNumber: string
  senderName: string
  senderPhone: string
  receiverName: string
  receiverPhone: string
  description: string
  weight: number
  dimensions: string
  originStation: string
  destinationStation: string
  assignedTrip: string
  price: number
  status: "pending" | "in_transit" | "delivered" | "cancelled"
  createdDate: string
  deliveryDate?: string
}

const mockParcels: Parcel[] = [
  {
    id: "PCL001",
    trackingNumber: "STC-PCL-001234",
    senderName: "Emmanuel Asante",
    senderPhone: "+233 24 111 2222",
    receiverName: "Grace Mensah",
    receiverPhone: "+233 20 333 4444",
    description: "Electronics - Mobile Phone",
    weight: 0.5,
    dimensions: "15x10x5 cm",
    originStation: "Accra Central",
    destinationStation: "Kumasi Central",
    assignedTrip: "SCH001",
    price: 25.0,
    status: "in_transit",
    createdDate: "2024-03-14",
  },
  {
    id: "PCL002",
    trackingNumber: "STC-PCL-001235",
    senderName: "Mary Osei",
    senderPhone: "+233 26 555 6666",
    receiverName: "John Kwame",
    receiverPhone: "+233 24 777 8888",
    description: "Documents - Legal Papers",
    weight: 0.2,
    dimensions: "30x20x2 cm",
    originStation: "Kumasi Central",
    destinationStation: "Accra Central",
    assignedTrip: "SCH002",
    price: 15.0,
    status: "pending",
    createdDate: "2024-03-15",
  },
  {
    id: "PCL003",
    trackingNumber: "STC-PCL-001236",
    senderName: "David Boateng",
    senderPhone: "+233 20 999 0000",
    receiverName: "Sarah Adjei",
    receiverPhone: "+233 24 123 4567",
    description: "Clothing - Traditional Wear",
    weight: 1.2,
    dimensions: "40x30x10 cm",
    originStation: "Takoradi Station",
    destinationStation: "Accra Central",
    assignedTrip: "SCH003",
    price: 30.0,
    status: "delivered",
    createdDate: "2024-03-12",
    deliveryDate: "2024-03-13",
  },
]

export function ParcelManagement({ searchTerm, onSearch }: { searchTerm: string; onSearch: (value: string) => void }) {
  const [parcels, setParcels] = useState<Parcel[]>(mockParcels)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_transit' | 'delivered' | 'cancelled'>('all');

  const filteredParcels = parcels.filter(
    (parcel) =>
      (statusFilter === 'all' || parcel.status === statusFilter) &&
      (parcel.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.receiverName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddParcel = () => {
    setEditingParcel(null)
    setIsDialogOpen(true)
  }

  const handleEditParcel = (parcel: Parcel) => {
    setEditingParcel(parcel)
    setIsDialogOpen(true)
  }

  const handleDeleteParcel = (parcelId: string) => {
    setParcels(parcels.filter((parcel) => parcel.id !== parcelId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_transit":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* Status Filter Dropdown */}
        <Select value={statusFilter === 'all' ? undefined : statusFilter} onValueChange={v => setStatusFilter((v as typeof statusFilter) || 'all')}>
          <SelectTrigger className="w-48 rounded-lg border border-[#B7FFD2] shadow-sm bg-white text-sm font-medium">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        {/* Add Button */}
        <Button onClick={handleAddParcel} className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white shadow-lg rounded-lg px-4 py-2 font-semibold transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          New Parcel
        </Button>
      </div>

      {/* Parcels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParcels.map((parcel) => (
          <Card key={parcel.id} className="bg-white rounded-xl shadow-lg border-0 p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{parcel.trackingNumber}</CardTitle>
                  <CardDescription>{parcel.description}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(parcel.status)} rounded-full px-3 py-1 font-semibold`}>
                  {parcel.status.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Sender:</p>
                  <p className="text-gray-600">{parcel.senderName}</p>
                  <p className="text-gray-600">{parcel.senderPhone}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Receiver:</p>
                  <p className="text-gray-600">{parcel.receiverName}</p>
                  <p className="text-gray-600">{parcel.receiverPhone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#008F37]" />
                <span className="text-sm">
                  {parcel.originStation} → {parcel.destinationStation}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Weight className="h-4 w-4 text-[#008F37]" />
                <span className="text-sm">
                  {parcel.weight} kg - {parcel.dimensions}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-[#008F37]" />
                <span className="text-sm">Trip: {parcel.assignedTrip}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-[#008F37]" />
                <span className="text-sm font-medium">GH₵ {parcel.price.toFixed(2)}</span>
              </div>

              <div className="text-sm text-gray-600">
                <p>Created: {parcel.createdDate}</p>
                {parcel.deliveryDate && <p>Delivered: {parcel.deliveryDate}</p>}
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => handleEditParcel(parcel)} className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white rounded-lg px-4 py-2 font-semibold transition hover:shadow-lg">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteParcel(parcel.id)}
                  className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white rounded-lg px-4 py-2 font-semibold transition hover:shadow-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Parcel Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingParcel ? "Edit Parcel" : "New Parcel Booking"}</DialogTitle>
            <DialogDescription>
              {editingParcel ? "Update parcel information" : "Create a new parcel delivery booking"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6">
            {/* Sender Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sender Information</h3>
              <div className="space-y-2">
                <Label htmlFor="senderName">Sender Name</Label>
                <Input id="senderName" placeholder="e.g., Emmanuel Asante" defaultValue={editingParcel?.senderName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderPhone">Sender Phone</Label>
                <Input id="senderPhone" placeholder="+233 24 111 2222" defaultValue={editingParcel?.senderPhone} />
              </div>
            </div>

            {/* Receiver Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Receiver Information</h3>
              <div className="space-y-2">
                <Label htmlFor="receiverName">Receiver Name</Label>
                <Input id="receiverName" placeholder="e.g., Grace Mensah" defaultValue={editingParcel?.receiverName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiverPhone">Receiver Phone</Label>
                <Input id="receiverPhone" placeholder="+233 20 333 4444" defaultValue={editingParcel?.receiverPhone} />
              </div>
            </div>

            {/* Parcel Details */}
            <div className="col-span-2 space-y-4">
              <h3 className="text-lg font-medium">Parcel Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="e.g., Electronics - Mobile Phone"
                    defaultValue={editingParcel?.description}
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="0.5"
                      defaultValue={editingParcel?.weight}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input id="dimensions" placeholder="e.g., 15x10x5 cm" defaultValue={editingParcel?.dimensions} />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="col-span-2 space-y-4">
              <h3 className="text-lg font-medium">Delivery Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originStation">Origin Station</Label>
                  <Select defaultValue={editingParcel?.originStation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Accra Central">Accra Central</SelectItem>
                      <SelectItem value="Kumasi Central">Kumasi Central</SelectItem>
                      <SelectItem value="Takoradi Station">Takoradi Station</SelectItem>
                      <SelectItem value="Tamale Station">Tamale Station</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destinationStation">Destination Station</Label>
                  <Select defaultValue={editingParcel?.destinationStation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Accra Central">Accra Central</SelectItem>
                      <SelectItem value="Kumasi Central">Kumasi Central</SelectItem>
                      <SelectItem value="Takoradi Station">Takoradi Station</SelectItem>
                      <SelectItem value="Tamale Station">Tamale Station</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTrip">Assigned Trip</Label>
                  <Select defaultValue={editingParcel?.assignedTrip}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trip" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCH001">SCH001 - 2024-03-15 08:00</SelectItem>
                      <SelectItem value="SCH002">SCH002 - 2024-03-15 10:00</SelectItem>
                      <SelectItem value="SCH003">SCH003 - 2024-03-15 14:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Pricing and Status */}
            <div className="space-y-2">
              <Label htmlFor="price">Price (GH₵)</Label>
              <Input id="price" type="number" step="0.01" placeholder="25.00" defaultValue={editingParcel?.price} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={editingParcel?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white rounded-lg px-4 py-2 font-semibold transition hover:shadow-lg">
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)} className="bg-gradient-to-r from-[#1D976C] to-[#93F9B9] text-white shadow-lg rounded-lg px-4 py-2 font-semibold transition hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white">
              {editingParcel ? "Update Parcel" : "Create Parcel Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
