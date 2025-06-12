"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PatientsChart() {
  // Data matching the image exactly
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

  // Create smooth curve paths
  const createSmoothPath = (points: number[], isTop: boolean = false) => {
    if (points.length < 2) return ""
    
    const chartWidth = 280
    const chartHeight = 192
    const stepX = chartWidth / (points.length - 1)
    
    let path = `M 0 ${chartHeight - (points[0] / maxValue) * chartHeight}`
    
    for (let i = 1; i < points.length; i++) {
      const x = i * stepX
      const y = chartHeight - (points[i] / maxValue) * chartHeight
      const prevX = (i - 1) * stepX
      const prevY = chartHeight - (points[i - 1] / maxValue) * chartHeight
      
      const cpX1 = prevX + stepX * 0.4
      const cpY1 = prevY
      const cpX2 = x - stepX * 0.4
      const cpY2 = y
      
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`
    }
    
    // Close the path for area fill
    if (isTop) {
      path += ` L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`
    } else {
      path += ` L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`
    }
    
    return path
  }

  const newPatientsData = chartData.map(d => d.newPatients)
  const returnPatientsData = chartData.map(d => d.returnPatients)
  const combinedData = chartData.map(d => d.newPatients + d.returnPatients)

  return (
    <Card className="rounded-[20px] border-none shadow-sm h-[400px]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-sf-pro font-semibold text-black">
          Patients
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chart container */}
        <div className="flex items-start mb-4">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between h-48 text-xs text-gray-500 mr-4">
            <span>400</span>
            <span>300</span>
            <span>200</span>
            <span>100</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="flex-1 relative">
            <svg className="w-full h-48" viewBox="0 0 280 192" preserveAspectRatio="none">
              {/* Background grid lines */}
              <defs>
                <pattern id="grid" width="40" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 48" fill="none" stroke="#f0f0f0" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Return Patients Area (bottom layer) */}
              <path
                d={createSmoothPath(returnPatientsData)}
                fill="url(#returnGradient)"
                stroke="#c4b5fd"
                strokeWidth="2"
                opacity="0.8"
              />
              
              {/* New Patients Area (top layer) */}
              <path
                d={createSmoothPath(combinedData, true)}
                fill="url(#newGradient)"
                stroke="#7165e1"
                strokeWidth="2"
                opacity="0.9"
              />
              
              {/* Gradients */}
              <defs>
                <linearGradient id="returnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.1"/>
                </linearGradient>
                <linearGradient id="newGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7165e1" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#7165e1" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
            </svg>
            
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