"use client"

import { Search, Calendar, Bell, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

interface HeaderProps {
  clinicName?: string
  location?: string
}

export function Header({ clinicName = "Vishnu Clinic", location = "Location" }: HeaderProps) {
  const currentDate = new Date()

  return (
    <header className="h-[60px] md:h-[80px] bg-white shadow-[0px_1px_30px_#7165e114] flex items-center px-3 md:px-[20px] justify-between">
      {/* Search - Hidden on mobile, shown on tablet+ */}
      <div className="hidden sm:flex w-full max-w-[350px] lg:w-[600px] h-[40px] md:h-[50px] bg-[#f4f3ff] rounded-[16px] items-center px-3 md:px-[20px]">
        <Search className="w-4 h-4 md:w-5 md:h-5 text-[#000000b2] flex-shrink-0" />
        <Input
          placeholder="Search patients, appointments..."
          className="ml-2 bg-transparent border-none text-sm md:text-base font-sf-pro font-medium placeholder:text-[#000000b2] focus-visible:ring-0"
        />
      </div>

      {/* Mobile Search Icon */}
      <div className="sm:hidden w-[40px] h-[40px] bg-[#f4f3ff] rounded-[16px] flex items-center justify-center">
        <Search className="w-4 h-4 text-[#7165e1]" />
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Date - Hidden on small mobile */}
        <div className="hidden xs:flex w-[120px] sm:w-[160px] md:w-[180px] h-[40px] md:h-[50px] bg-[#f4f3ff] rounded-[16px] items-center justify-center px-2">
          <Calendar className="w-5 h-5 md:w-[28px] md:h-[28px] mr-1 md:mr-[8px] text-[#7165e1] flex-shrink-0" />
          <span className="text-xs md:text-base text-black font-sf-pro font-medium truncate">
            {formatDate(currentDate)}
          </span>
        </div>

        {/* Notifications */}
        <div className="w-[40px] md:w-[50px] h-[40px] md:h-[50px] bg-[#f4f3ff] rounded-[16px] flex items-center justify-center">
          <Bell className="w-5 h-5 md:w-[26px] md:h-[26px] text-[#7165e1]" />
        </div>

        {/* Profile - Now clickable */}
        <Link href="/profile">
          <div className="w-[180px] sm:w-[220px] md:w-[280px] h-[40px] md:h-[50px] bg-[#f4f3ff] rounded-[16px] flex items-center px-2 md:px-3 hover:bg-[#eeebff] transition-colors cursor-pointer">
            <Avatar className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-xl flex-shrink-0">
              <AvatarImage src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" />
              <AvatarFallback className="bg-[#7165e1] text-white font-sf-pro font-semibold text-sm md:text-base rounded-xl">
                {clinicName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-2 md:ml-3 flex-1 min-w-0">
              <p className="text-sm md:text-lg text-black font-sf-pro font-semibold truncate">
                {clinicName}
              </p>
              <p className="text-xs md:text-sm text-black font-sf-pro truncate">
                {location}
              </p>
            </div>
            <ChevronDown className="ml-auto w-[12px] h-[6px] md:w-[15px] md:h-[8px] flex-shrink-0" />
          </div>
        </Link>
      </div>
    </header>
  )
}