"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { PatientsOverview } from "./patients-overview"
import { PatientsChart } from "./patients-chart"
import { AppointmentsChart } from "./appointments-chart"
import { AppointmentOverview } from "./appointment-overview"
import { RevenueOverview } from "./revenue-overview"
import { RevenueChart } from "./revenue-chart"

interface AnalyticsData {
  revenue: {
    thisMonth: number
    lastMonth: number
    growth: number
  }
  patients: {
    total: number
    growth: number
  }
  appointments: {
    completionRate: number
    total: number
  }
}

interface AnalyticsClientProps {
  initialData: AnalyticsData
}

export function AnalyticsClient({ initialData }: AnalyticsClientProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week")

  const periods = ["Today", "This Week", "This Month", "This Year"]

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1] mb-6">
        Analytics Dashboard
      </h1>

      {/* Time Period Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {periods.map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            onClick={() => setSelectedPeriod(period)}
            className={`h-10 px-4 rounded-lg font-sf-pro font-medium ${
              selectedPeriod === period
                ? "bg-[#7165e1] text-white hover:bg-[#5f52d1]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {period}
          </Button>
        ))}
        
        <Button
          variant="outline"
          className="h-10 w-10 p-0 rounded-lg border-gray-300 hover:bg-gray-50 ml-2"
        >
          <Calendar className="w-4 h-4 text-[#7165e1]" />
        </Button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Row 1: Patients Overview and Patients Chart */}
        <div className="lg:col-span-1">
          <PatientsOverview />
        </div>
        <div className="lg:col-span-1">
          <PatientsChart />
        </div>

        {/* Row 2: Appointments Chart and Appointment Overview */}
        <div className="lg:col-span-1">
          <AppointmentsChart />
        </div>
        <div className="lg:col-span-1">
          <AppointmentOverview />
        </div>

        {/* Row 3: Revenue Overview and Revenue Chart */}
        <div className="lg:col-span-1">
          <RevenueOverview />
        </div>
        <div className="lg:col-span-1">
          <RevenueChart />
        </div>
      </div>
    </>
  )
}