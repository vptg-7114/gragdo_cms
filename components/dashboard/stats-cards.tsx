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
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Total patients",
      value: stats.totalPatients.toString(),
      icon: Users,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Check-Ins",
      value: stats.checkIns.toString(),
      icon: UserCheck,
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-400"
    },
    {
      title: "Available Doctors",
      value: stats.availableDoctors.toString(),
      icon: Stethoscope,
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="rounded-[20px] border-none shadow-sm digigo-card">
          <CardContent className="p-4 md:p-6 flex items-center">
            <div className={`w-[50px] h-[50px] md:w-[72px] md:h-[72px] ${stat.bgColor} rounded-[12px] md:rounded-[14.4px] flex items-center justify-center flex-shrink-0`}>
              <stat.icon className={`w-8 h-8 md:w-12 md:h-12 ${stat.iconColor}`} />
            </div>
            <div className="ml-4 md:ml-[38px] min-w-0 flex-1">
              <p className="text-sm md:text-xl digigo-text-muted font-sf-pro font-medium truncate">
                {stat.title}
              </p>
              <p className="text-2xl md:text-[40px] text-[#7165e1] dark:text-[#9b8ff5] font-sf-pro font-bold">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}