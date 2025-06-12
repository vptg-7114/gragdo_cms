"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AppointmentOverview() {
  // Data matching the image exactly
  const data = {
    generalCheckup: 660,
    surgery: 949,
    diagnosis: 818
  }

  const total = data.generalCheckup + data.surgery + data.diagnosis
  const generalPercentage = (data.generalCheckup / total) * 100
  const surgeryPercentage = (data.surgery / total) * 100
  const diagnosisPercentage = (data.diagnosis / total) * 100

  return (
    <Card className="rounded-[20px] border-none shadow-sm h-[400px]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-sf-pro font-semibold text-black">
          Appointment Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-full">
        {/* Pie Chart */}
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* General Checkup segment */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#7165e1"
              strokeWidth="15"
              strokeDasharray={`${generalPercentage * 2.199} 219.9`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Surgery segment (largest) */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#a855f7"
              strokeWidth="15"
              strokeDasharray={`${surgeryPercentage * 2.199} 219.9`}
              strokeDashoffset={`-${generalPercentage * 2.199}`}
              strokeLinecap="round"
            />
            {/* Diagnosis segment */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#c4b5fd"
              strokeWidth="15"
              strokeDasharray={`${diagnosisPercentage * 2.199} 219.9`}
              strokeDashoffset={`-${(generalPercentage + surgeryPercentage) * 2.199}`}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Data labels positioned around the chart */}
          <div className="absolute top-2 left-4 text-center">
            <span className="text-lg font-bold text-black">{data.generalCheckup}</span>
          </div>
          
          <div className="absolute top-4 right-0 text-center">
            <span className="text-lg font-bold text-black">{data.surgery}</span>
          </div>
          
          <div className="absolute bottom-4 left-0 text-center">
            <span className="text-lg font-bold text-black">{data.diagnosis}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#7165e1] rounded"></div>
            <span className="text-gray-600">General Checkup</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#a855f7] rounded"></div>
            <span className="text-gray-600">Surgery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#c4b5fd] rounded"></div>
            <span className="text-gray-600">Diagnosis</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}