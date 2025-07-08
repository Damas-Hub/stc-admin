"use client"

import { Bell } from "lucide-react"
import { useAuth } from "../auth/auth-context"

export function Header({ isDashboard }: { isDashboard: boolean }) {
  const { user } = useAuth();
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          {isDashboard && (
            <>
              <h2 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.name}</h2>
              <p className="text-gray-600 mt-1 text-base">Here's what's happening with your transport operations today.</p>
            </>
          )}
        </div>
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </header>
  );
}
