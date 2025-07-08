"use client"

import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "../auth/auth-context"

export function Header({ isDashboard, onOpenSidebar }: { isDashboard: boolean, onOpenSidebar?: () => void }) {
  const { user } = useAuth();
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30 px-3 py-2 sm:px-6 sm:py-4 md:px-8 md:py-5">
      {/* Mobile: icons row */}
      <div className="flex flex-row items-center justify-between sm:hidden mb-2">
        {onOpenSidebar && (
          <button className="p-2 rounded-md border border-gray-200 bg-white" onClick={onOpenSidebar} aria-label="Open sidebar menu">
            <Menu className="h-6 w-6" />
          </button>
        )}
        <div className="flex-1 flex items-center justify-end space-x-2">
          <div className="relative w-32">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search..." className="pl-10 w-full text-xs" />
          </div>
          <Button variant="ghost" size="icon" className="ml-1">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {/* Welcome message row */}
      <div className="flex flex-col space-y-1 flex-1 min-w-0">
        {isDashboard && (
          <>
            <h2 className="text-base sm:text-2xl font-semibold text-gray-900 truncate">Welcome back, {user?.name}</h2>
            <p className="text-gray-600 text-xs sm:text-base truncate">Here's what's happening with your transport operations today.</p>
          </>
        )}
      </div>
      {/* Desktop: icons row */}
      <div className="hidden sm:flex items-center space-x-4 mt-2 sm:mt-0">
        {onOpenSidebar && (
          <button className="sm:hidden mr-2 p-2 rounded-md border border-gray-200 bg-white" onClick={onOpenSidebar} aria-label="Open sidebar menu">
            <Menu className="h-6 w-6" />
          </button>
        )}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search..." className="pl-10 w-full text-base" />
        </div>
        <Button variant="ghost" size="icon" className="ml-1">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
