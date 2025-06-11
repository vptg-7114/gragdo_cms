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
    <div className="grid grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="rounded-[20px] border-none shadow-sm">
          <CardContent className="p-6 flex items-center">
            <div className={`w-[72px] h-[72px] ${stat.bgColor} rounded-[14.4px] flex items-center justify-center`}>
              <stat.icon className={`w-12 h-12 ${stat.iconColor}`} />
            </div>
            <div className="ml-[38px]">
              <p className="text-xl text-[#888888] font-sf-pro font-medium">
                {stat.title}
              </p>
              <p className="text-[40px] text-[#7165e1] font-sf-pro font-bold">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}