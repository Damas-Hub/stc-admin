"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Settings, Users, MapPin } from "lucide-react"

interface Bus {
  id: string
  registrationNumber: string
  model: string
  type: string
  capacity: number
  status: "active" | "maintenance" | "inactive"
  assignedStation: string
  lastMaintenance: string
  nextMaintenance: string
  seatLayout: string
}

const mockBuses: Bus[] = [
  {
    id: "BUS001",
    registrationNumber: "GH-1234-20",
    model: "Mercedes Benz Sprinter",
    type: "VIP",
    capacity: 32,
    status: "active",
    assignedStation: "Accra Central",
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
    seatLayout: "2+2",
  },
  {
    id: "BUS002",
    registrationNumber: "GH-5678-21",
    model: "Hyundai Universe",
    type: "Standard",
    capacity: 45,
    status: "active",
    assignedStation: "Kumasi Central",
    lastMaintenance: "2024-02-01",
    nextMaintenance: "2024-05-01",
    seatLayout: "2+3",
  },
  {
    id: "BUS003",
    registrationNumber: "GH-9876-19",
    model: "Yutong ZK6122H",
    type: "Executive",
    capacity: 28,
    status: "maintenance",
    assignedStation: "Takoradi Station",
    lastMaintenance: "2024-02-20",
    nextMaintenance: "2024-03-05",
    seatLayout: "2+1",
  },
]

export function BusManagement() {
  const [buses, setBuses] = useState<Bus[]>(mockBuses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBus, setEditingBus] = useState<Bus | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)
  const [showSeatLayout, setShowSeatLayout] = useState(false)

  const filteredBuses = buses.filter(
    (bus) =>
      bus.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.assignedStation.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddBus = () => {
    setEditingBus(null)
    setIsDialogOpen(true)
  }

  const handleEditBus = (bus: Bus) => {
    setEditingBus(bus)
    setIsDialogOpen(true)
  }

  const handleDeleteBus = (busId: string) => {
    setBuses(buses.filter((bus) => bus.id !== busId))
  }

  const handleViewSeatLayout = (bus: Bus) => {
    setSelectedBus(bus)
    setShowSeatLayout(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderSeatLayout = (bus: Bus) => {
    const rows = Math.ceil(bus.capacity / (bus.seatLayout === "2+1" ? 3 : bus.seatLayout === "2+2" ? 4 : 5))
    const seatsPerRow = bus.seatLayout === "2+1" ? 3 : bus.seatLayout === "2+2" ? 4 : 5

    return (
      <div className="space-y-2">
        <div className="text-center text-sm font-medium text-gray-600 mb-4">Driver</div>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-2">
            {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
              const seatNumber = rowIndex * seatsPerRow + seatIndex + 1
              if (seatNumber > bus.capacity) return null

              return (
                <div
                  key={seatIndex}
                  className="w-8 h-8 bg-green-100 border border-green-300 rounded flex items-center justify-center text-xs font-medium"
                >
                  {seatNumber}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={handleAddBus}>
          <Plus className="mr-2 h-4 w-4" />
          Add Bus
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Buses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by registration number, model, or station..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Buses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuses.map((bus) => (
          <Card key={bus.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{bus.registrationNumber}</CardTitle>
                  <CardDescription>{bus.model}</CardDescription>
                </div>
                <Badge className={getStatusColor(bus.status)}>{bus.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {bus.capacity} seats ({bus.seatLayout})
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{bus.assignedStation}</span>
              </div>

              <div>
                <Badge variant="outline">{bus.type}</Badge>
              </div>

              <div className="text-sm">
                <p className="text-gray-600">Last Maintenance: {bus.lastMaintenance}</p>
                <p className="text-gray-600">Next Maintenance: {bus.nextMaintenance}</p>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => handleViewSeatLayout(bus)} className="flex-1">
                  <Settings className="mr-2 h-4 w-4" />
                  Layout
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditBus(bus)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteBus(bus.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Bus Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBus ? "Edit Bus" : "Add New Bus"}</DialogTitle>
            <DialogDescription>
              {editingBus ? "Update bus information" : "Add a new bus to the fleet"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="regNumber">Registration Number</Label>
              <Input id="regNumber" placeholder="e.g., GH-1234-20" defaultValue={editingBus?.registrationNumber} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Bus Model</Label>
              <Input id="model" placeholder="e.g., Mercedes Benz Sprinter" defaultValue={editingBus?.model} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Bus Type</Label>
              <Select defaultValue={editingBus?.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bus type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Seating Capacity</Label>
              <Input id="capacity" type="number" placeholder="32" defaultValue={editingBus?.capacity} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seatLayout">Seat Layout</Label>
              <Select defaultValue={editingBus?.seatLayout}>
                <SelectTrigger>
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2+1">2+1</SelectItem>
                  <SelectItem value="2+2">2+2</SelectItem>
                  <SelectItem value="2+3">2+3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="station">Assigned Station</Label>
              <Select defaultValue={editingBus?.assignedStation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select station" />
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
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={editingBus?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextMaintenance">Next Maintenance</Label>
              <Input id="nextMaintenance" type="date" defaultValue={editingBus?.nextMaintenance} />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>{editingBus ? "Update Bus" : "Add Bus"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Seat Layout Dialog */}
      <Dialog open={showSeatLayout} onOpenChange={setShowSeatLayout}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Seat Layout - {selectedBus?.registrationNumber}</DialogTitle>
            <DialogDescription>
              {selectedBus?.capacity} seats in {selectedBus?.seatLayout} configuration
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">{selectedBus && renderSeatLayout(selectedBus)}</div>

          <div className="flex justify-end">
            <Button onClick={() => setShowSeatLayout(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
