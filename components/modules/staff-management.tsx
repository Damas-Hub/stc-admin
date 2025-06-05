"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Phone, Mail, MapPin, Shield } from "lucide-react"

interface Staff {
  id: string
  staffId: string
  fullName: string
  email: string
  phone: string
  role: string
  assignedStation: string
  status: "active" | "inactive"
  hireDate: string
  permissions: string[]
}

const mockStaff: Staff[] = [
  {
    id: "STF001",
    staffId: "STC-STF-001",
    fullName: "Sarah Adjei",
    email: "sarah.adjei@stc.com",
    phone: "+233 24 111 2222",
    role: "Station Manager",
    assignedStation: "Accra Central",
    status: "active",
    hireDate: "2019-05-15",
    permissions: ["booking_management", "parcel_management", "schedule_view"],
  },
  {
    id: "STF002",
    staffId: "STC-STF-002",
    fullName: "Michael Boateng",
    email: "michael.boateng@stc.com",
    phone: "+233 20 333 4444",
    role: "Booking Agent",
    assignedStation: "Kumasi Central",
    status: "active",
    hireDate: "2020-08-20",
    permissions: ["booking_management", "schedule_view"],
  },
  {
    id: "STF003",
    staffId: "STC-STF-003",
    fullName: "Grace Owusu",
    email: "grace.owusu@stc.com",
    phone: "+233 26 555 6666",
    role: "Customer Service",
    assignedStation: "Takoradi Station",
    status: "inactive",
    hireDate: "2021-02-10",
    permissions: ["booking_view", "customer_support"],
  },
]

export function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>(mockStaff)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStaff = staff.filter(
    (member) =>
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddStaff = () => {
    setEditingStaff(null)
    setIsDialogOpen(true)
  }

  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember)
    setIsDialogOpen(true)
  }

  const handleDeleteStaff = (staffId: string) => {
    setStaff(staff.filter((member) => member.id !== staffId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Station Manager":
        return "bg-green-100 text-green-800"
      case "Booking Agent":
        return "bg-purple-100 text-purple-800"
      case "Customer Service":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-2">Manage non-driver staff and their permissions</p>
        </div>
        <Button onClick={handleAddStaff}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, staff ID, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Station Manager">Station Manager</SelectItem>
                <SelectItem value="Booking Agent">Booking Agent</SelectItem>
                <SelectItem value="Customer Service">Customer Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staffMember) => (
          <Card key={staffMember.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{staffMember.fullName}</CardTitle>
                  <CardDescription>{staffMember.staffId}</CardDescription>
                </div>
                <Badge className={getStatusColor(staffMember.status)}>{staffMember.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <Badge className={getRoleColor(staffMember.role)}>{staffMember.role}</Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{staffMember.email}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{staffMember.phone}</span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{staffMember.assignedStation}</span>
              </div>

              <div className="text-sm">
                <p className="font-medium text-gray-700 mb-1">Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {staffMember.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>Hired: {staffMember.hireDate}</p>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => handleEditStaff(staffMember)} className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteStaff(staffMember.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Staff Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
            <DialogDescription>
              {editingStaff ? "Update staff information" : "Add a new staff member to the system"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staffId">Staff ID</Label>
              <Input id="staffId" placeholder="e.g., STC-STF-001" defaultValue={editingStaff?.staffId} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="e.g., Sarah Adjei" defaultValue={editingStaff?.fullName} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="sarah.adjei@stc.com" defaultValue={editingStaff?.email} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+233 24 111 2222" defaultValue={editingStaff?.phone} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue={editingStaff?.role}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Station Manager">Station Manager</SelectItem>
                  <SelectItem value="Booking Agent">Booking Agent</SelectItem>
                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                  <SelectItem value="Maintenance Staff">Maintenance Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedStation">Assigned Station</Label>
              <Select defaultValue={editingStaff?.assignedStation}>
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
              <Select defaultValue={editingStaff?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date</Label>
              <Input id="hireDate" type="date" defaultValue={editingStaff?.hireDate} />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>{editingStaff ? "Update Staff" : "Add Staff"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
