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

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <DashboardOverview />
      case "routes":
        return <RouteManagement />
      case "buses":
        return <BusManagement />
      case "drivers":
        return <DriverManagement />
      case "staff":
        return <StaffManagement />
      case "schedules":
        return <ScheduleManagement />
      case "bookings":
        return <BookingManagement />
      case "parcels":
        return <ParcelManagement />
      case "analytics":
        return <AnalyticsDashboard  />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">{renderActiveModule()}</main>
      </div>
    </div>
  )
}
