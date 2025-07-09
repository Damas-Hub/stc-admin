"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Calendar, Clock, Bus, User } from "lucide-react"

interface Schedule {
  id: string
  routeId: string
  routeName: string
  busId: string
  driverId: string
  driverName: string
  date: string
  departureTime: string
  arrivalTime: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  bookedSeats: number
  totalSeats: number
}

const mockSchedules: Schedule[] = [
  {
    id: "SCH001",
    routeId: "RT001",
    routeName: "Accra - Kumasi Express",
    busId: "GH-1234-20",
    driverId: "DRV001",
    driverName: "John Mensah",
    date: "2024-03-15",
    departureTime: "08:00",
    arrivalTime: "12:30",
    status: "scheduled",
    bookedSeats: 28,
    totalSeats: 32,
  },
  {
    id: "SCH002",
    routeId: "RT002",
    routeName: "Accra - Takoradi Coastal",
    busId: "GH-5678-21",
    driverId: "DRV002",
    driverName: "Mary Asante",
    date: "2024-03-15",
    departureTime: "10:00",
    arrivalTime: "13:45",
    status: "in_progress",
    bookedSeats: 42,
    totalSeats: 45,
  },
  {
    id: "SCH003",
    routeId: "RT001",
    routeName: "Accra - Kumasi Express",
    busId: "GH-1234-20",
    driverId: "DRV001",
    driverName: "John Mensah",
    date: "2024-03-14",
    departureTime: "14:00",
    arrivalTime: "18:30",
    status: "completed",
    bookedSeats: 30,
    totalSeats: 32,
  },
]

export function ScheduleManagement({ searchTerm, onSearch }: { searchTerm: string; onSearch: (value: string) => void }) {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [selectedDate, setSelectedDate] = useState("2024-03-15")
  const [activeTab, setActiveTab] = useState("daily")
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'>('all');

  const filteredSchedules = schedules.filter((schedule) => {
    const statusMatch = statusFilter === 'all' ? true : schedule.status === statusFilter;
    if (activeTab === "daily") {
      return statusMatch && schedule.date === selectedDate;
    }
    return statusMatch;
  })

  const handleAddSchedule = () => {
    setEditingSchedule(null)
    setIsDialogOpen(true)
  }

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setIsDialogOpen(true)
  }

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== scheduleId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
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
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        {/* Add Button */}
        <Button onClick={handleAddSchedule} className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white shadow-lg rounded-lg px-4 py-2 font-semibold transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      {/* Schedule Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="daily">Daily View</TabsTrigger>
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="monthly">Monthly View</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card className="bg-white rounded-xl shadow-lg border-0 p-6">
            <CardHeader>
              <CardTitle>Daily Schedule</CardTitle>
              <CardDescription>View and manage today's trips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Label htmlFor="date">Select Date:</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-48"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchedules.map((schedule) => {
              const occupancyPercentage = (schedule.bookedSeats / schedule.totalSeats) * 100
              return (
                <Card key={schedule.id} className="bg-white rounded-xl shadow-lg border-0 p-6">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{schedule.routeName}</CardTitle>
                        <CardDescription>Schedule ID: {schedule.id}</CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(schedule.status)} rounded-full px-3 py-1 font-semibold`}>
                        {schedule.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-[#008F37]" />
                      <span className="text-sm">Date: {schedule.date}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-[#008F37]" />
                      <span className="text-sm">
                        Departure: {schedule.departureTime} - Arrival: {schedule.arrivalTime}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Bus className="h-4 w-4 text-[#008F37]" />
                      <span className="text-sm">Bus: {schedule.busId}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-[#008F37]" />
                      <span className="text-sm">Driver: {schedule.driverName}</span>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Seat Occupancy</span>
                        <span className={`text-sm font-bold ${getOccupancyColor(occupancyPercentage)}`}>
                          {occupancyPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${occupancyPercentage}%` }} />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {schedule.bookedSeats} / {schedule.totalSeats} seats
                      </p>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSchedule(schedule)}
                        className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white shadow-lg rounded-lg px-4 py-2 font-semibold transition-all duration-300"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white shadow-lg rounded-lg px-4 py-2 font-semibold transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card className="bg-white rounded-xl shadow-lg border-0 p-6">
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Overview of the week's scheduled trips</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Weekly view implementation would show a calendar grid with scheduled trips.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card className="bg-white rounded-xl shadow-lg border-0 p-6">
            <CardHeader>
              <CardTitle>Monthly Schedule</CardTitle>
              <CardDescription>Monthly overview of all scheduled trips</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Monthly view implementation would show a calendar with trip summaries.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Schedule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg">
          <DialogHeader>
            <DialogTitle>{editingSchedule ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
            <DialogDescription>
              {editingSchedule ? "Update schedule information" : "Create a new trip schedule"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="route">Route</Label>
              <Select defaultValue={editingSchedule?.routeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RT001">Accra - Kumasi Express</SelectItem>
                  <SelectItem value="RT002">Accra - Takoradi Coastal</SelectItem>
                  <SelectItem value="RT003">Kumasi - Tamale Northern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bus">Bus</Label>
              <Select defaultValue={editingSchedule?.busId}>
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
              <Label htmlFor="driver">Driver</Label>
              <Select defaultValue={editingSchedule?.driverId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRV001">John Mensah</SelectItem>
                  <SelectItem value="DRV002">Mary Asante</SelectItem>
                  <SelectItem value="DRV003">David Osei</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" defaultValue={editingSchedule?.date} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departureTime">Departure Time</Label>
              <Input id="departureTime" type="time" defaultValue={editingSchedule?.departureTime} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arrivalTime">Arrival Time</Label>
              <Input id="arrivalTime" type="time" defaultValue={editingSchedule?.arrivalTime} />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={editingSchedule?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white rounded-lg px-4 py-2 font-semibold transition hover:shadow-lg">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-[#1D976C] to-[#93F9B9] text-white shadow-lg rounded-lg px-4 py-2 font-semibold transition hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white">
              {editingSchedule ? "Update Schedule" : "Create Schedule"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
