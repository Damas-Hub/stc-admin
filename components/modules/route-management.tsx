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
import { Plus, Edit, Trash2, MapPin, Clock, DollarSign } from "lucide-react"

interface Route {
  id: string
  name: string
  origin: string
  destination: string
  stops: string[]
  fare: number
  estimatedTime: string
  status: "active" | "inactive" | "maintenance"
  busType: string
}

const mockRoutes: Route[] = [
  {
    id: "RT001",
    name: "Accra - Kumasi Express",
    origin: "Accra Central",
    destination: "Kumasi Central",
    stops: ["Nsawam", "Suhum", "Kibi", "Anyinam"],
    fare: 45.0,
    estimatedTime: "4h 30m",
    status: "active",
    busType: "VIP",
  },
  {
    id: "RT002",
    name: "Accra - Takoradi Coastal",
    origin: "Accra Central",
    destination: "Takoradi Station",
    stops: ["Winneba", "Cape Coast", "Elmina"],
    fare: 35.0,
    estimatedTime: "3h 45m",
    status: "active",
    busType: "Standard",
  },
  {
    id: "RT003",
    name: "Kumasi - Tamale Northern",
    origin: "Kumasi Central",
    destination: "Tamale Station",
    stops: ["Techiman", "Kintampo", "Bole"],
    fare: 55.0,
    estimatedTime: "6h 15m",
    status: "maintenance",
    busType: "VIP",
  },
]

export function RouteManagement() {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRoutes = routes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddRoute = () => {
    setEditingRoute(null)
    setIsDialogOpen(true)
  }

  const handleEditRoute = (route: Route) => {
    setEditingRoute(route)
    setIsDialogOpen(true)
  }

  const handleDeleteRoute = (routeId: string) => {
    setRoutes(routes.filter((route) => route.id !== routeId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={handleAddRoute}>
          <Plus className="mr-2 h-4 w-4" />
          Add Route
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by route name, origin, or destination..."
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
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutes.map((route) => (
          <Card key={route.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{route.name}</CardTitle>
                  <CardDescription>Route ID: {route.id}</CardDescription>
                </div>
                <Badge className={getStatusColor(route.status)}>{route.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {route.origin} → {route.destination}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{route.estimatedTime}</span>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-sm">GH₵ {route.fare.toFixed(2)}</span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Stops:</p>
                <p className="text-sm text-gray-600">{route.stops.join(", ")}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Bus Type:</p>
                <Badge variant="outline">{route.busType}</Badge>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => handleEditRoute(route)} className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteRoute(route.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Route Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-full w-full max-h-[90vh] p-2 sm:p-4 overflow-y-auto flex flex-col gap-2">
          <DialogHeader>
            <DialogTitle>{editingRoute ? "Edit Route" : "Add New Route"}</DialogTitle>
            <DialogDescription>
              {editingRoute ? "Update route information" : "Create a new transport route"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="routeName">Route Name</Label>
              <Input id="routeName" placeholder="e.g., Accra - Kumasi Express" defaultValue={editingRoute?.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routeId">Route ID</Label>
              <Input id="routeId" placeholder="e.g., RT001" defaultValue={editingRoute?.id} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input id="origin" placeholder="e.g., Accra Central" defaultValue={editingRoute?.origin} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" placeholder="e.g., Kumasi Central" defaultValue={editingRoute?.destination} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fare">Standard Fare (GH₵)</Label>
              <Input id="fare" type="number" step="0.01" placeholder="45.00" defaultValue={editingRoute?.fare} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input id="estimatedTime" placeholder="e.g., 4h 30m" defaultValue={editingRoute?.estimatedTime} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="busType">Bus Type</Label>
              <Select defaultValue={editingRoute?.busType}>
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
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={editingRoute?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="stops">Intermediate Stops</Label>
              <Textarea
                id="stops"
                placeholder="Enter stops separated by commas (e.g., Nsawam, Suhum, Kibi)"
                defaultValue={editingRoute?.stops.join(", ")}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>{editingRoute ? "Update Route" : "Create Route"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
