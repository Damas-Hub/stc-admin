"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Settings, Users, MapPin, Printer } from "lucide-react"
import { differenceInDays, parseISO } from 'date-fns';
import { useAuth } from "../auth/auth-context";
import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Bus {
  id: string
  registrationNumber: string
  chassisNumber: string
  engineNumber: string
  dateOfRegistration: string
  licenseExpiryDate: string
  roadworthyCertificateNumber: string
  insurancePolicyNumber: string
  assignedDepot: string
  status: "active" | "maintenance" | "decommissioned"
  // Specifications
  brand: string
  model: string
  yearOfManufacture: string
  engineCapacity: string
  fuelType: "Diesel" | "Petrol" | "CNG" | "Electric"
  transmissionType: "Manual" | "Automatic"
  odometerReading: string
  maxLoadCapacity: string
  fuelTankCapacity: string
  // Seating Arrangement
  capacity: number
  seatArrangement: string
  seatNumberingFormat: string
  driverSeatPosition: string
  coDriverSeatPosition: string
  emergencyExitLocation: string
  toilet: boolean
  specialAccessSeats: string
  // Amenities & Features
  airConditioning: boolean
  wifi: boolean
  entertainmentSystem: boolean
  recliningSeats: boolean
  usbChargingPorts: boolean
  readingLights: boolean
  cctv: boolean
  paSystem: boolean
  refrigerator: boolean
  emergencyToolsKit: boolean
  lastMaintenance: string
  nextMaintenance: string
  seatLayout: string // (legacy, can be removed later)
}

const mockBuses: Bus[] = [
  {
    id: "BUS001",
    registrationNumber: "GH-1234-20",
    chassisNumber: "CH1234567890",
    engineNumber: "EN9876543210",
    dateOfRegistration: "2022-01-10",
    licenseExpiryDate: "2025-01-10",
    roadworthyCertificateNumber: "RW123456",
    insurancePolicyNumber: "IN123456",
    assignedDepot: "Accra Central",
    status: "active",
    brand: "Mercedes Benz",
    model: "Sprinter",
    yearOfManufacture: "2020",
    engineCapacity: "2.2L",
    fuelType: "Diesel",
    transmissionType: "Manual",
    odometerReading: "120000",
    maxLoadCapacity: "5000",
    fuelTankCapacity: "100",
    capacity: 32,
    seatArrangement: "2+2",
    seatNumberingFormat: "1A, 1B, 2A, 2B...",
    driverSeatPosition: "Front Left",
    coDriverSeatPosition: "Front Right",
    emergencyExitLocation: "Middle Right",
    toilet: false,
    specialAccessSeats: "1A (VIP), 8B (Disabled)",
    airConditioning: true,
    wifi: true,
    entertainmentSystem: false,
    recliningSeats: true,
    usbChargingPorts: true,
    readingLights: true,
    cctv: false,
    paSystem: true,
    refrigerator: false,
    emergencyToolsKit: true,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
    seatLayout: "2+2",
  },
  {
    id: "BUS002",
    registrationNumber: "GH-5678-21",
    chassisNumber: "CH1234567891",
    engineNumber: "EN9876543211",
    dateOfRegistration: "2022-02-15",
    licenseExpiryDate: "2025-02-15",
    roadworthyCertificateNumber: "RW123457",
    insurancePolicyNumber: "IN123457",
    assignedDepot: "Kumasi Central",
    status: "active",
    brand: "Hyundai",
    model: "Universe",
    yearOfManufacture: "2021",
    engineCapacity: "2.0L",
    fuelType: "Petrol",
    transmissionType: "Automatic",
    odometerReading: "80000",
    maxLoadCapacity: "4000",
    fuelTankCapacity: "80",
    capacity: 45,
    seatArrangement: "2+3",
    seatNumberingFormat: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45",
    driverSeatPosition: "Front Left",
    coDriverSeatPosition: "Front Right",
    emergencyExitLocation: "Middle Right",
    toilet: true,
    specialAccessSeats: "1 (VIP), 2 (Disabled), 3 (Wheelchair), 4 (Emergency)",
    airConditioning: true,
    wifi: true,
    entertainmentSystem: true,
    recliningSeats: true,
    usbChargingPorts: true,
    readingLights: true,
    cctv: true,
    paSystem: true,
    refrigerator: true,
    emergencyToolsKit: true,
    lastMaintenance: "2024-02-01",
    nextMaintenance: "2024-05-01",
    seatLayout: "2+3",
  },
  {
    id: "BUS003",
    registrationNumber: "GH-9876-19",
    chassisNumber: "CH1234567892",
    engineNumber: "EN9876543212",
    dateOfRegistration: "2022-03-20",
    licenseExpiryDate: "2025-03-20",
    roadworthyCertificateNumber: "RW123458",
    insurancePolicyNumber: "IN123458",
    assignedDepot: "Takoradi Station",
    status: "maintenance",
    brand: "Yutong",
    model: "ZK6122H",
    yearOfManufacture: "2019",
    engineCapacity: "3.0L",
    fuelType: "Diesel",
    transmissionType: "Manual",
    odometerReading: "150000",
    maxLoadCapacity: "6000",
    fuelTankCapacity: "120",
    capacity: 28,
    seatArrangement: "2+1",
    seatNumberingFormat: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28",
    driverSeatPosition: "Front Left",
    coDriverSeatPosition: "Front Right",
    emergencyExitLocation: "Middle Right",
    toilet: false,
    specialAccessSeats: "1 (VIP), 2 (Disabled), 3 (Wheelchair)",
    airConditioning: true,
    wifi: false,
    entertainmentSystem: false,
    recliningSeats: false,
    usbChargingPorts: false,
    readingLights: false,
    cctv: false,
    paSystem: false,
    refrigerator: false,
    emergencyToolsKit: false,
    lastMaintenance: "2024-02-20",
    nextMaintenance: "2024-03-05",
    seatLayout: "2+1",
  },
]

// Mock audit log data
const mockAuditLog = [
  { action: 'Added Bus', user: 'John Admin', date: '2024-05-01 10:23', details: 'GH-1234-20' },
  { action: 'Edited Bus', user: 'John Admin', date: '2024-05-02 14:10', details: 'GH-5678-21' },
  { action: 'Deleted Bus', user: 'John Admin', date: '2024-05-03 09:45', details: 'GH-9876-19' },
];

export function BusManagement({ searchTerm, onSearch }: { searchTerm: string; onSearch: (value: string) => void }) {
  const { user } = useAuth();
  const [buses, setBuses] = useState<Bus[]>(mockBuses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBus, setEditingBus] = useState<Bus | null>(null)
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)
  const [showSeatLayout, setShowSeatLayout] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'maintenance' | 'decommissioned'>('all');

  // Form state for add/edit
  const initialForm: Bus = editingBus || {
    id: '',
    registrationNumber: '',
    chassisNumber: '',
    engineNumber: '',
    dateOfRegistration: '',
    licenseExpiryDate: '',
    roadworthyCertificateNumber: '',
    insurancePolicyNumber: '',
    assignedDepot: '',
    status: 'active',
    brand: '',
    model: '',
    yearOfManufacture: '',
    engineCapacity: '',
    fuelType: 'Diesel',
    transmissionType: 'Manual',
    odometerReading: '',
    maxLoadCapacity: '',
    fuelTankCapacity: '',
    capacity: 0,
    seatArrangement: '',
    seatNumberingFormat: '',
    driverSeatPosition: '',
    coDriverSeatPosition: '',
    emergencyExitLocation: '',
    toilet: false,
    specialAccessSeats: '',
    airConditioning: false,
    wifi: false,
    entertainmentSystem: false,
    recliningSeats: false,
    usbChargingPorts: false,
    readingLights: false,
    cctv: false,
    paSystem: false,
    refrigerator: false,
    emergencyToolsKit: false,
    lastMaintenance: '',
    nextMaintenance: '',
    seatLayout: '',
  };
  const [form, setForm] = useState<Bus>(initialForm);

  // Update form state when editingBus changes
  React.useEffect(() => {
    setForm(editingBus || initialForm);
    // eslint-disable-next-line
  }, [editingBus, isDialogOpen]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === 'number' ? Number(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingBus) {
      // Update existing bus
      setBuses((prev) => prev.map((b) => (b.id === editingBus.id ? { ...form, id: editingBus.id } : b)));
    } else {
      // Add new bus
      setBuses((prev) => [
        ...prev,
        { ...form, id: `BUS${Date.now()}` },
      ]);
    }
    setIsDialogOpen(false);
    setEditingBus(null);
  }

  const filteredBuses = buses.filter(
    (bus) =>
      (statusFilter === 'all' || bus.status === statusFilter) &&
      (bus.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.model.toLowerCase().includes(searchTerm.toLowerCase())),
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

  function getExpiryStatus(dateString: string) {
    if (!dateString) return null;
    const today = new Date();
    const expiry = parseISO(dateString);
    const days = differenceInDays(expiry, today);
    if (days < 0) return 'expired';
    if (days <= 30) return 'expiring';
    return null;
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

  // Add a print handler
  function handlePrint(busId: string) {
    // Add a print class to the bus card, remove after printing
    const card = document.getElementById(`bus-card-${busId}`);
    if (card) {
      card.classList.add('print-bus-sheet');
      window.print();
      setTimeout(() => card.classList.remove('print-bus-sheet'), 1000);
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="decommissioned">Decommissioned</SelectItem>
          </SelectContent>
        </Select>
        {/* Add Button */}
        <Button onClick={handleAddBus} className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white shadow-lg rounded-lg px-4 py-2 font-semibold transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Add Bus
        </Button>
      </div>

      {/* Buses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuses.map((bus) => (
          <Card key={bus.id} id={`bus-card-${bus.id}`} className="hover:shadow-lg transition-shadow lg:p-8 bg-white rounded-xl shadow-lg border-0">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold">{bus.registrationNumber}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">{bus.brand} {bus.model} ({bus.yearOfManufacture})</CardDescription>
                </div>
                <Badge className={`${getStatusColor(bus.status)} text-sm font-semibold rounded-full px-3 py-1`}>{bus.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="multiple" className="w-full rounded-xl bg-[#F8FFFB]">
                <AccordionItem value="registration">
                  <AccordionTrigger className="text-[#008F37] font-semibold text-base">Registration</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <div>Chassis: {bus.chassisNumber}</div>
                      <div>Engine: {bus.engineNumber}</div>
                      <div>Date Registered: {bus.dateOfRegistration}</div>
                      <div>License Expiry: {bus.licenseExpiryDate}</div>
                      <div>Roadworthy: {bus.roadworthyCertificateNumber}</div>
                      <div>Insurance: {bus.insurancePolicyNumber}</div>
                      <div>Depot/Region: {bus.assignedDepot}</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="specs">
                  <AccordionTrigger className="text-[#008F37] font-semibold text-base">Specifications</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <div>Brand: {bus.brand}</div>
                      <div>Model: {bus.model}</div>
                      <div>Year: {bus.yearOfManufacture}</div>
                      <div>Engine Capacity: {bus.engineCapacity}</div>
                      <div>Fuel: {bus.fuelType}</div>
                      <div>Transmission: {bus.transmissionType}</div>
                      <div>Odometer: {bus.odometerReading} km</div>
                      <div>Max Load: {bus.maxLoadCapacity} kg</div>
                      <div>Fuel Tank: {bus.fuelTankCapacity} L</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="seating">
                  <AccordionTrigger className="text-[#008F37] font-semibold text-base">Seating</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <div>Capacity: {bus.capacity}</div>
                      <div>Arrangement: {bus.seatArrangement}</div>
                      <div>Numbering: {bus.seatNumberingFormat}</div>
                      <div>Driver Seat: {bus.driverSeatPosition}</div>
                      <div>Co-driver Seat: {bus.coDriverSeatPosition}</div>
                      <div>Emergency Exit: {bus.emergencyExitLocation}</div>
                      <div>Toilet: {bus.toilet ? "Yes" : "No"}</div>
                      <div>Special Access: {bus.specialAccessSeats}</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="amenities">
                  <AccordionTrigger className="text-[#008F37] font-semibold text-base">Amenities</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <div>Air-conditioning: {bus.airConditioning ? "Yes" : "No"}</div>
                      <div>Wi-Fi: {bus.wifi ? "Yes" : "No"}</div>
                      <div>Entertainment: {bus.entertainmentSystem ? "Yes" : "No"}</div>
                      <div>Reclining Seats: {bus.recliningSeats ? "Yes" : "No"}</div>
                      <div>USB Ports: {bus.usbChargingPorts ? "Yes" : "No"}</div>
                      <div>Reading Lights: {bus.readingLights ? "Yes" : "No"}</div>
                      <div>CCTV: {bus.cctv ? "Yes" : "No"}</div>
                      <div>PA System: {bus.paSystem ? "Yes" : "No"}</div>
                      <div>Refrigerator: {bus.refrigerator ? "Yes" : "No"}</div>
                      <div>Emergency Kit: {bus.emergencyToolsKit ? "Yes" : "No"}</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="maintenance">
                  <AccordionTrigger className="text-[#008F37] font-semibold text-base">Maintenance</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm">
                      <p className="text-gray-600">Last Maintenance: {bus.lastMaintenance}</p>
                      <p className="text-gray-600">Next Maintenance: {bus.nextMaintenance}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => handleViewSeatLayout(bus)} className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white rounded-lg px-4 py-2 font-semibold transition-colors duration-300">
                  <Settings className="mr-2 h-4 w-4" />
                  Layout
                </Button>
                {user?.role === "hq_admin" && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleEditBus(bus)} className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white rounded-lg px-4 py-2 font-semibold transition-colors duration-300">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBus(bus.id)}
                      className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white rounded-lg px-4 py-2 font-semibold transition-colors duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePrint(bus.id)} title="Print Data Sheet" className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white rounded-lg px-4 py-2 font-semibold transition-colors duration-300">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Bus Dialog - only for hq_admin */}
      {user?.role === "hq_admin" && (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg">
          <DialogHeader>
            <DialogTitle>{editingBus ? "Edit Bus" : "Add New Bus"}</DialogTitle>
            <DialogDescription>
                {editingBus ? "Update bus information" : "Register a new bus in the fleet"}
            </DialogDescription>
          </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <Card className="border-none shadow-none bg-white rounded-xl shadow-lg border-0 p-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Registration Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-0">
                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input id="registrationNumber" value={form.registrationNumber} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="chassisNumber">Chassis Number</Label>
                    <Input id="chassisNumber" value={form.chassisNumber} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="engineNumber">Engine Number</Label>
                    <Input id="engineNumber" value={form.engineNumber} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="dateOfRegistration">Date of Registration</Label>
                    <Input id="dateOfRegistration" type="date" value={form.dateOfRegistration} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
                    <Input id="licenseExpiryDate" type="date" value={form.licenseExpiryDate} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="roadworthyCertificateNumber">Roadworthy Certificate Number</Label>
                    <Input id="roadworthyCertificateNumber" value={form.roadworthyCertificateNumber} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="insurancePolicyNumber">Insurance Policy Number</Label>
                    <Input id="insurancePolicyNumber" value={form.insurancePolicyNumber} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="assignedDepot">Assigned Depot/Region</Label>
                    <Input id="assignedDepot" value={form.assignedDepot} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="status">Operational Status</Label>
                    <Select value={form.status} onValueChange={value => setForm({ ...form, status: value })}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Under Maintenance</SelectItem>
                        <SelectItem value="decommissioned">Decommissioned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              <div className="border-t my-2" />
              <Card className="border-none shadow-none bg-white rounded-xl shadow-lg border-0 p-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Bus Specifications</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-0">
                  <div>
                    <Label htmlFor="brand">Brand/Manufacturer</Label>
                    <Input id="brand" value={form.brand} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="model">Model Type</Label>
                    <Input id="model" value={form.model} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="yearOfManufacture">Year of Manufacture</Label>
                    <Input id="yearOfManufacture" type="number" value={form.yearOfManufacture} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="engineCapacity">Engine Capacity</Label>
                    <Input id="engineCapacity" value={form.engineCapacity} onChange={handleChange} required />
            </div>
                  <div>
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select value={form.fuelType} onValueChange={value => setForm({ ...form, fuelType: value as Bus["fuelType"] })}>
                      <SelectTrigger id="fuelType">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="CNG">CNG</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                      </SelectContent>
                    </Select>
            </div>
                  <div>
                    <Label htmlFor="transmissionType">Transmission Type</Label>
                    <Select value={form.transmissionType} onValueChange={value => setForm({ ...form, transmissionType: value as Bus["transmissionType"] })}>
                      <SelectTrigger id="transmissionType">
                        <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
            </div>
                  <div>
                    <Label htmlFor="odometerReading">Odometer Reading</Label>
                    <Input id="odometerReading" type="number" value={form.odometerReading} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="maxLoadCapacity">Maximum Load Capacity (kg)</Label>
                    <Input id="maxLoadCapacity" type="number" value={form.maxLoadCapacity} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="fuelTankCapacity">Fuel Tank Capacity (Litres)</Label>
                    <Input id="fuelTankCapacity" type="number" value={form.fuelTankCapacity} onChange={handleChange} required />
                  </div>
                </CardContent>
              </Card>
              <div className="border-t my-2" />
              <Card className="border-none shadow-none bg-white rounded-xl shadow-lg border-0 p-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Bus Seating Arrangement</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-0">
                  <div>
              <Label htmlFor="capacity">Seating Capacity</Label>
                    <Input id="capacity" type="number" value={form.capacity} onChange={handleChange} required />
            </div>
                  <div>
                    <Label htmlFor="seatArrangement">Seat Arrangement</Label>
                    <Select value={form.seatArrangement} onValueChange={value => setForm({ ...form, seatArrangement: value })}>
                      <SelectTrigger id="seatArrangement">
                        <SelectValue placeholder="Select arrangement" />
                </SelectTrigger>
                <SelectContent>
                        <SelectItem value="2+2">2+2</SelectItem>
                  <SelectItem value="2+1">2+1</SelectItem>
                        <SelectItem value="Sleeper">Sleeper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="seatNumberingFormat">Seat Numbering Format</Label>
                    <Input id="seatNumberingFormat" value={form.seatNumberingFormat} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="driverSeatPosition">Driver Seat Position</Label>
                    <Input id="driverSeatPosition" value={form.driverSeatPosition} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="coDriverSeatPosition">Co-driver Seat Position</Label>
                    <Input id="coDriverSeatPosition" value={form.coDriverSeatPosition} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="emergencyExitLocation">Emergency Exit Location</Label>
                    <Input id="emergencyExitLocation" value={form.emergencyExitLocation} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="toilet">Toilet Facility</Label>
                    <Select value={form.toilet ? "yes" : "no"} onValueChange={value => setForm({ ...form, toilet: value === "yes" })}>
                      <SelectTrigger id="toilet">
                        <SelectValue placeholder="Toilet available?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="specialAccessSeats">Special Access Seats</Label>
                    <Input id="specialAccessSeats" value={form.specialAccessSeats} onChange={handleChange} />
                  </div>
                </CardContent>
              </Card>
              <div className="border-t my-2" />
              <Card className="border-none shadow-none bg-white rounded-xl shadow-lg border-0 p-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Amenities & Features</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-0">
                  <div>
                    <Label htmlFor="airConditioning">Air-conditioning</Label>
                    <Select value={form.airConditioning ? "yes" : "no"} onValueChange={value => setForm({ ...form, airConditioning: value === "yes" })}>
                      <SelectTrigger id="airConditioning">
                        <SelectValue placeholder="Air-conditioning?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="wifi">Wi-Fi Availability</Label>
                    <Select value={form.wifi ? "yes" : "no"} onValueChange={value => setForm({ ...form, wifi: value === "yes" })}>
                      <SelectTrigger id="wifi">
                        <SelectValue placeholder="Wi-Fi?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="entertainmentSystem">Onboard Entertainment System</Label>
                    <Select value={form.entertainmentSystem ? "yes" : "no"} onValueChange={value => setForm({ ...form, entertainmentSystem: value === "yes" })}>
                      <SelectTrigger id="entertainmentSystem">
                        <SelectValue placeholder="Entertainment system?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="recliningSeats">Reclining Seats</Label>
                    <Select value={form.recliningSeats ? "yes" : "no"} onValueChange={value => setForm({ ...form, recliningSeats: value === "yes" })}>
                      <SelectTrigger id="recliningSeats">
                        <SelectValue placeholder="Reclining seats?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="usbChargingPorts">USB Charging Ports</Label>
                    <Select value={form.usbChargingPorts ? "yes" : "no"} onValueChange={value => setForm({ ...form, usbChargingPorts: value === "yes" })}>
                      <SelectTrigger id="usbChargingPorts">
                        <SelectValue placeholder="USB charging ports?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="readingLights">Reading Lights</Label>
                    <Select value={form.readingLights ? "yes" : "no"} onValueChange={value => setForm({ ...form, readingLights: value === "yes" })}>
                      <SelectTrigger id="readingLights">
                        <SelectValue placeholder="Reading lights?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
                  <div>
                    <Label htmlFor="cctv">CCTV System</Label>
                    <Select value={form.cctv ? "yes" : "no"} onValueChange={value => setForm({ ...form, cctv: value === "yes" })}>
                      <SelectTrigger id="cctv">
                        <SelectValue placeholder="CCTV system?" />
                </SelectTrigger>
                <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
                  <div>
                    <Label htmlFor="paSystem">PA (Public Address) System</Label>
                    <Select value={form.paSystem ? "yes" : "no"} onValueChange={value => setForm({ ...form, paSystem: value === "yes" })}>
                      <SelectTrigger id="paSystem">
                        <SelectValue placeholder="PA system?" />
                </SelectTrigger>
                <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
                  <div>
                    <Label htmlFor="refrigerator">Refrigerator/Refreshment Unit</Label>
                    <Select value={form.refrigerator ? "yes" : "no"} onValueChange={value => setForm({ ...form, refrigerator: value === "yes" })}>
                      <SelectTrigger id="refrigerator">
                        <SelectValue placeholder="Refrigerator?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
            </div>
                  <div>
                    <Label htmlFor="emergencyToolsKit">Emergency Tools Kit</Label>
                    <Select value={form.emergencyToolsKit ? "yes" : "no"} onValueChange={value => setForm({ ...form, emergencyToolsKit: value === "yes" })}>
                      <SelectTrigger id="emergencyToolsKit">
                        <SelectValue placeholder="Emergency tools kit?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
          </div>
                </CardContent>
              </Card>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-white border border-[#008F37] text-[#008F37] hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white rounded-lg px-4 py-2 font-semibold transition hover:shadow-lg">
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-[#1D976C] to-[#93F9B9] text-white shadow-lg rounded-lg px-4 py-2 font-semibold transition hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] hover:text-white">
                  {editingBus ? "Update Bus" : "Create Bus"}
                </Button>
              </div>
            </form>
        </DialogContent>
      </Dialog>
      )}

      {/* Seat Layout Dialog */}
      <Dialog open={showSeatLayout} onOpenChange={setShowSeatLayout}>
        <DialogContent className="max-w-md bg-white rounded-xl shadow-lg border-0 p-6">
          <DialogHeader>
            <DialogTitle>Seat Layout - {selectedBus?.registrationNumber}</DialogTitle>
            <DialogDescription>
              {selectedBus?.capacity} seats in {selectedBus?.seatLayout} configuration
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">{selectedBus && renderSeatLayout(selectedBus)}</div>

          <div className="flex justify-end">
            <Button onClick={() => setShowSeatLayout(false)} className="bg-gradient-to-r from-[#1D976C] to-[#93F9B9] text-white hover:bg-gradient-to-r hover:from-[#1D976C] hover:to-[#93F9B9] shadow-lg rounded-lg px-4 py-2 font-semibold transition-colors duration-300">Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audit Log - only for hq_admin */}
      {user?.role === "hq_admin" && (
        <Card className="mt-8 bg-white rounded-xl shadow-lg border-0 p-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Audit Log</CardTitle>
            <CardDescription>Recent changes to fleet records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Action</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">User</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAuditLog.map((log, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="px-4 py-2 text-gray-700">{log.action}</td>
                      <td className="px-4 py-2 text-gray-700">{log.user}</td>
                      <td className="px-4 py-2 text-gray-700">{log.date}</td>
                      <td className="px-4 py-2 text-gray-700">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
