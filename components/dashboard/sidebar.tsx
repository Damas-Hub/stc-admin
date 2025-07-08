"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "../auth/auth-context"
import type { ActiveModule } from "./dashboard"
import { LayoutDashboard, Route, Bus, Users, UserCheck, Calendar, Ticket, Package, LogOut, ChartBar, Menu, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface SidebarProps {
  activeModule: ActiveModule
  setActiveModule: (module: ActiveModule) => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

export function Sidebar({ activeModule, setActiveModule, mobileOpen, setMobileOpen }: SidebarProps) {
  const { user, logout } = useAuth();

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
  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user?.role || ""));

  // Sidebar content as a function for reuse
  const sidebarContent = (
    <>
      <div className="p-4 sm:p-6 border-b bg-black flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/stc-logo.png" alt="STC Ghana" className="h-8 w-auto sm:h-10" />
        </div>
        {/* Mobile close button */}
        <button
          className="sm:hidden p-1 rounded-full hover:bg-gray-200 text-white"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 p-2 sm:p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeModule === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-base md:text-sm lg:text-base py-2 sm:py-2.5 px-2 sm:px-3",
                activeModule === item.id && "bg-green-600 text-white hover:bg-green-700"
              )}
              onClick={() => {
                setActiveModule(item.id);
                setMobileOpen(false);
              }}
            >
              <Icon className="mr-3 h-5 w-5 md:h-4 md:w-4 lg:h-5 lg:w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      <div className="p-2 sm:p-4 border-t">
        <div className="mb-2 sm:mb-4">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <p className="text-xs text-green-600 capitalize">{user?.role?.replace("_", " ")}</p>
        </div>
        <Button variant="outline" className="w-full justify-start py-2 px-2" onClick={logout}>
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  );

  // Main sidebar (hidden on mobile)
  return (
    <>
      <div className="hidden sm:flex flex-col bg-white shadow-lg h-full w-64 md:w-48 lg:w-64 transition-all duration-200">
        {sidebarContent}
      </div>
      {/* Mobile Slide-in Drawer */}
      <div className={
        `sm:hidden fixed inset-0 z-50 ${mobileOpen ? '' : 'pointer-events-none'}`
      } aria-hidden={!mobileOpen}>
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-56 bg-white shadow-lg transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {sidebarContent}
        </div>
      </div>
      {/* Prevent background scroll when drawer is open */}
      {mobileOpen && (
        <style>{`body { overflow: hidden !important; }`}</style>
      )}
    </>
  );
}

// SidebarDrawer for use in header if needed
export function SidebarDrawer({ open, onOpenChange, children }: { open: boolean, onOpenChange: (v: boolean) => void, children: React.ReactNode }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-xs w-64 h-screen left-0 top-0 rounded-none border-none">
        <div className="h-full flex flex-col bg-white">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
