"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PatientsChart() {
  // Mock data for the area chart
  const chartData = [
    { day: 'Jun 1', newPatients: 200, returnPatients: 150 },
    { day: 'Jun 2', newPatients: 180, returnPatients: 200 },
    { day: 'Jun 3', newPatients: 220, returnPatients: 180 },
    { day: 'Jun 4', newPatients: 190, returnPatients: 220 },
    { day: 'Jun 5', newPatients: 250, returnPatients: 200 },
    { day: 'Jun 6', newPatients: 230, returnPatients: 240 },
    { day: 'Jun 7', newPatients: 280, returnPatients: 260 },
  ]

  const maxValue = 400

  return (
    <Card className="rounded-[20px] border-none shadow-sm h-[400px]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-sf-pro font-semibold text-black">
          Patients
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Y-axis labels */}
        <div className="flex items-start mb-4">
          <div className="flex flex-col justify-between h-48 text-xs text-gray-500 mr-4">
            <span>400</span>
            <span>300</span>
            <span>200</span>
            <span>100</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="flex-1">
            <div className="relative h-48 flex items-end justify-between">
              {chartData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  {/* Stacked areas */}
                  <div className="relative w-full max-w-[40px] flex flex-col justify-end">
                    {/* Return patients (bottom layer) */}
                    <div 
                      className="w-full bg-[#c4b5fd] rounded-t"
                      style={{ 
                        height: `${(data.returnPatients / maxValue) * 192}px`,
                        borderRadius: '4px 4px 0 0'
                      }}
                    />
                    {/* New patients (top layer) */}
                    <div 
                      className="w-full bg-[#7165e1] rounded-t"
                      style={{ 
                        height: `${(data.newPatients / maxValue) * 192}px`,
                        borderRadius: '4px 4px 0 0'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {chartData.map((data, index) => (
                <span key={index} className="text-center">{data.day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 text-sm mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#7165e1] rounded"></div>
            <span className="text-gray-600">New Patients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#c4b5fd] rounded"></div>
            <span className="text-gray-600">Return Patients</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}