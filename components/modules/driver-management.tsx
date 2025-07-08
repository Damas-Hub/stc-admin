"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Phone, Mail, Bus } from "lucide-react"

interface Driver {
  id: string
  driverId: string
  fullName: string
  email: string
  phone: string
  address: string
  licenseNumber: string
  licenseExpiry: string
  assignedBus: string
  status: "active" | "inactive" | "suspended"
  hireDate: string
  totalTrips: number
}

const mockDrivers: Driver[] = [
  {
    id: "DRV001",
    driverId: "STC-DRV-001",
    fullName: "John Mensah",
    email: "john.mensah@stc.com",
    phone: "+233 24 123 4567",
    address: "Accra, Greater Accra",
    licenseNumber: "DL-123456789",
    licenseExpiry: "2025-06-15",
    assignedBus: "GH-1234-20",
    status: "active",
    hireDate: "2020-03-15",
    totalTrips: 1250,
  },
  {
    id: "DRV002",
    driverId: "STC-DRV-002",
    fullName: "Mary Asante",
    email: "mary.asante@stc.com",
    phone: "+233 20 987 6543",
    address: "Kumasi, Ashanti Region",
    licenseNumber: "DL-987654321",
    licenseExpiry: "2024-12-20",
    assignedBus: "GH-5678-21",
    status: "active",
    hireDate: "2019-08-10",
    totalTrips: 1580,
  },
  {
    id: "DRV003",
    driverId: "STC-DRV-003",
    fullName: "David Osei",
    email: "david.osei@stc.com",
    phone: "+233 26 555 7890",
    address: "Takoradi, Western Region",
    licenseNumber: "DL-456789123",
    licenseExpiry: "2024-04-30",
    assignedBus: "GH-9876-19",
    status: "suspended",
    hireDate: "2021-01-20",
    totalTrips: 890,
  },
]

export function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.driverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddDriver = () => {
    setEditingDriver(null)
    setIsDialogOpen(true)
  }

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver)
    setIsDialogOpen(true)
  }

  const handleDeleteDriver = (driverId: string) => {
    setDrivers(drivers.filter((driver) => driver.id !== driverId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    return expiry <= thirtyDaysFromNow
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={handleAddDriver}>
          <Plus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, driver ID, or license number..."
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
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <Card key={driver.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{driver.fullName}</CardTitle>
                  <CardDescription>{driver.driverId}</CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getStatusColor(driver.status)}>{driver.status}</Badge>
                  {isLicenseExpiringSoon(driver.licenseExpiry) && (
                    <Badge variant="destructive" className="text-xs">
                      License Expiring
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{driver.email}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{driver.phone}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Bus className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Bus: {driver.assignedBus}</span>
              </div>

              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">License:</span> {driver.licenseNumber}
                </p>
                <p>
                  <span className="font-medium">Expires:</span> {driver.licenseExpiry}
                </p>
                <p>
                  <span className="font-medium">Total Trips:</span> {driver.totalTrips}
                </p>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => handleEditDriver(driver)} className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteDriver(driver.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Driver Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingDriver ? "Edit Driver" : "Add New Driver"}</DialogTitle>
            <DialogDescription>
              {editingDriver ? "Update driver information" : "Add a new driver to the system"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="driverId">Driver ID</Label>
              <Input id="driverId" placeholder="e.g., STC-DRV-001" defaultValue={editingDriver?.driverId} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="e.g., John Mensah" defaultValue={editingDriver?.fullName} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.mensah@stc.com" defaultValue={editingDriver?.email} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+233 24 123 4567" defaultValue={editingDriver?.phone} />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="e.g., Accra, Greater Accra" defaultValue={editingDriver?.address} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input id="licenseNumber" placeholder="e.g., DL-123456789" defaultValue={editingDriver?.licenseNumber} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseExpiry">License Expiry</Label>
              <Input id="licenseExpiry" type="date" defaultValue={editingDriver?.licenseExpiry} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedBus">Assigned Bus</Label>
              <Select defaultValue={editingDriver?.assignedBus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GH-1234-20">GH-1234-20</SelectItem>
                  <SelectItem value="GH-5678-21">GH-5678-21</SelectItem>
                  <SelectItem value="GH-9876-19">GH-9876-19</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={editingDriver?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date</Label>
              <Input id="hireDate" type="date" defaultValue={editingDriver?.hireDate} />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>{editingDriver ? "Update Driver" : "Add Driver"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
