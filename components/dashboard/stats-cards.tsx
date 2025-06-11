import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, UserCheck, Stethoscope } from "lucide-react"

interface StatsCardsProps {
  stats: {
    appointments: number
    totalPatients: number
    checkIns: number
    availableDoctors: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      title: "Appointments",
      value: stats.appointments.toString(),
      icon: Calendar,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Total patients",
      value: stats.totalPatients.toString(),
      icon: Users,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Check-Ins",
      value: stats.checkIns.toString(),
      icon: UserCheck,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      title: "Available Doctors",
      value: stats.availableDoctors.toString(),
      icon: Stethoscope,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="rounded-[16px] border-none shadow-sm">
          <CardContent className="p-3 md:p-4 flex items-center">
            <div className={`w-[40px] h-[40px] md:w-[50px] md:h-[50px] ${stat.bgColor} rounded-[10px] md:rounded-[12px] flex items-center justify-center flex-shrink-0`}>
              <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.iconColor}`} />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-xs md:text-sm text-[#888888] font-sf-pro font-medium truncate">
                {stat.title}
              </p>
              <p className="text-lg md:text-2xl text-[#7165e1] font-sf-pro font-bold">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}