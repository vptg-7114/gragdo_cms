"use client"

import { Search, Calendar, Bell, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/utils"

interface HeaderProps {
  clinicName?: string
  location?: string
}

export function Header({ clinicName = "Vishnu Clinic", location = "Location" }: HeaderProps) {
  const currentDate = new Date()

  return (
    <header className="h-[80px] md:h-[118px] bg-white shadow-[0px_1px_30px_#7165e114] flex items-center px-4 md:px-[34px] justify-between">
      {/* Search - Hidden on mobile, shown on tablet+ */}
      <div className="hidden sm:flex w-full max-w-[400px] lg:w-[716px] h-[50px] md:h-[66px] bg-[#f4f3ff] rounded-[20px] items-center px-4 md:px-[29px]">
        <Search className="w-5 h-5 md:w-6 md:h-6 text-[#000000b2] flex-shrink-0" />
        <Input
          placeholder="Search patients, appointments..."
          className="ml-2.5 bg-transparent border-none text-sm md:text-lg font-sf-pro font-medium placeholder:text-[#000000b2] focus-visible:ring-0"
        />
      </div>

      {/* Mobile Search Icon */}
      <div className="sm:hidden w-[50px] h-[50px] bg-[#f4f3ff] rounded-[20px] flex items-center justify-center">
        <Search className="w-5 h-5 text-[#7165e1]" />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Date - Hidden on small mobile */}
        <div className="hidden xs:flex w-[140px] sm:w-[180px] md:w-[221px] h-[50px] md:h-[66px] bg-[#f4f3ff] rounded-[20px] items-center justify-center px-2">
          <Calendar className="w-6 h-6 md:w-[34px] md:h-[34px] mr-2 md:mr-[11px] text-[#7165e1] flex-shrink-0" />
          <span className="text-sm md:text-xl text-black font-sf-pro font-medium truncate">
            {formatDate(currentDate)}
          </span>
        </div>

        {/* Notifications */}
        <div className="w-[50px] md:w-[71px] h-[50px] md:h-[66px] bg-[#f4f3ff] rounded-[20px] flex items-center justify-center">
          <Bell className="w-6 h-6 md:w-[33px] md:h-[33px] text-[#7165e1]" />
        </div>

        {/* Profile */}
        <div className="w-[200px] sm:w-[250px] md:w-[327px] h-[50px] md:h-[66px] bg-[#f4f3ff] rounded-[20px] flex items-center px-3 md:px-4">
          <Avatar className="w-[35px] h-[35px] md:w-[50px] md:h-[50px] rounded-xl md:rounded-2xl flex-shrink-0">
            <AvatarImage src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" />
            <AvatarFallback className="bg-[#7165e1] text-white font-sf-pro font-semibold text-sm md:text-base">
              {clinicName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 md:ml-[22px] flex-1 min-w-0">
            <p className="text-sm md:text-xl text-black font-sf-pro font-semibold truncate">
              {clinicName}
            </p>
            <p className="text-xs md:text-base text-black font-sf-pro truncate">
              {location}
            </p>
          </div>
          <ChevronDown className="ml-auto w-[15px] h-[8px] md:w-[17px] md:h-[9px] flex-shrink-0" />
        </div>
      </div>
    </header>
  )
}