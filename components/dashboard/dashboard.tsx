"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { DashboardOverview } from "./dashboard-overview"
import { RouteManagement } from "../modules/route-management"
import { BusManagement } from "../modules/bus-management"
import { DriverManagement } from "../modules/driver-management"
import { StaffManagement } from "../modules/staff-management"
import { ScheduleManagement } from "../modules/schedule-management"
import { BookingManagement } from "../modules/booking-management"
import { ParcelManagement } from "../modules/parcel-management"
import { useAuth } from "../auth/auth-context"
import { AnalyticsDashboard } from "../modules/analytics-management"

export type ActiveModule = "dashboard" | "routes" | "buses" | "drivers" | "staff" | "schedules" | "bookings" | "parcels" | "analytics"

export function Dashboard() {
  const [activeModule, setActiveModule] = useState<ActiveModule>("dashboard")
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <DashboardOverview />
      case "routes":
        return <RouteManagement searchTerm={searchTerm} onSearch={setSearchTerm} />
      case "buses":
        return <BusManagement searchTerm={searchTerm} onSearch={setSearchTerm} />
      case "drivers":
        return <DriverManagement searchTerm={searchTerm} onSearch={setSearchTerm} />
      case "staff":
        return <StaffManagement searchTerm={searchTerm} onSearch={setSearchTerm} />
      case "schedules":
        return <ScheduleManagement searchTerm={searchTerm} onSearch={setSearchTerm} />
      case "bookings":
        return <BookingManagement searchTerm={searchTerm} onSearch={setSearchTerm} />
      case "parcels":
        return <ParcelManagement searchTerm={searchTerm} onSearch={setSearchTerm} />
      case "analytics":
        return <AnalyticsDashboard searchTerm={searchTerm} onSearch={setSearchTerm} />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        mobileOpen={sidebarOpen}
        setMobileOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          isDashboard={activeModule === "dashboard"}
          onOpenSidebar={() => setSidebarOpen(true)}
          activeModule={activeModule}
          onSearch={setSearchTerm}
          user={user}
        />
        <main className="flex-1 overflow-auto p-3 sm:p-6">{renderActiveModule()}</main>
      </div>
    </div>
  )
}
