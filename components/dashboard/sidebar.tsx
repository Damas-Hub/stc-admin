"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "../auth/auth-context"
import type { ActiveModule } from "./dashboard"
import { LayoutDashboard, Route, Bus, Users, UserCheck, Calendar, Ticket, Package, LogOut, ChartBar } from "lucide-react"

interface SidebarProps {
  activeModule: ActiveModule
  setActiveModule: (module: ActiveModule) => void
}

export function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const { user, logout } = useAuth()

  const menuItems = [
    {
      id: "dashboard" as ActiveModule,
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["hq_admin", "station_personnel", "driver"],
    },
    {
      id: "routes" as ActiveModule,
      label: "Routes",
      icon: Route,
      roles: ["hq_admin"],
    },
    {
      id: "buses" as ActiveModule,
      label: "Buses",
      icon: Bus,
      roles: ["hq_admin"],
    },
    {
      id: "drivers" as ActiveModule,
      label: "Drivers",
      icon: UserCheck,
      roles: ["hq_admin"],
    },
    {
      id: "staff" as ActiveModule,
      label: "Staff",
      icon: Users,
      roles: ["hq_admin"],
    },
    {
      id: "schedules" as ActiveModule,
      label: "Schedules",
      icon: Calendar,
      roles: ["hq_admin", "station_personnel", "driver"],
    },
    {
      id: "bookings" as ActiveModule,
      label: "Bookings",
      icon: Ticket,
      roles: ["hq_admin", "station_personnel"],
    },
    {
      id: "parcels" as ActiveModule,
      label: "Parcels",
      icon: Package,
      roles: ["hq_admin", "station_personnel"],
    },
    {
      id: "analytics" as ActiveModule,
      label: "Analytics",
      icon: ChartBar,
      roles: ["hq_admin"],
    },

  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user?.role || ""))

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b bg-black">
        <div className="flex items-center space-x-2 ">
          <div>
            <img src="/stc-logo.png" alt="STC Ghana" className="h-10 w-auto" />
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeModule === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeModule === item.id && "bg-green-600 text-white hover:bg-green-700",
              )}
              onClick={() => setActiveModule(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <p className="text-xs text-green-600 capitalize">{user?.role?.replace("_", " ")}</p>
        </div>
        <Button variant="outline" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
