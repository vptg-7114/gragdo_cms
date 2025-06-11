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
    <header className="h-[118px] bg-white shadow-[0px_1px_30px_#7165e114] flex items-center px-[34px] justify-between">
      {/* Search */}
      <div className="w-[716px] h-[66px] bg-[#f4f3ff] rounded-[20px] flex items-center px-[29px]">
        <Search className="w-6 h-6 text-[#000000b2]" />
        <Input
          placeholder="Search patients, appointments..."
          className="ml-2.5 bg-transparent border-none text-lg font-sf-pro font-medium placeholder:text-[#000000b2] focus-visible:ring-0"
        />
      </div>

      {/* Date */}
      <div className="w-[221px] h-[66px] bg-[#f4f3ff] rounded-[20px] flex items-center justify-center">
        <Calendar className="w-[34px] h-[34px] mr-[11px] text-[#7165e1]" />
        <span className="text-xl text-black font-sf-pro font-medium">
          {formatDate(currentDate)}
        </span>
      </div>

      {/* Notifications */}
      <div className="w-[71px] h-[66px] bg-[#f4f3ff] rounded-[20px] flex items-center justify-center">
        <Bell className="w-[33px] h-[33px] text-[#7165e1]" />
      </div>

      {/* Profile */}
      <div className="w-[327px] h-[66px] bg-[#f4f3ff] rounded-[20px] flex items-center px-4">
        <Avatar className="w-[50px] h-[50px] rounded-2xl">
          <AvatarImage src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" />
          <AvatarFallback className="bg-[#7165e1] text-white font-sf-pro font-semibold">
            {clinicName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-[22px]">
          <p className="text-xl text-black font-sf-pro font-semibold">
            {clinicName}
          </p>
          <p className="text-base text-black font-sf-pro">
            {location}
          </p>
        </div>
        <ChevronDown className="ml-auto w-[17px] h-[9px]" />
      </div>
    </header>
  )
}