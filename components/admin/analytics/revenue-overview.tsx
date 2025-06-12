"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RevenueOverview() {
  // Mock data for the pie chart
  const data = {
    cash: 660,
    cards: 940,
    upi: 818
  }

  const total = data.cash + data.cards + data.upi
  const cashPercentage = (data.cash / total) * 100
  const cardsPercentage = (data.cards / total) * 100
  const upiPercentage = (data.upi / total) * 100

  return (
    <Card className="rounded-[20px] border-none shadow-sm h-[400px]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-sf-pro font-semibold text-black">
          Revenue Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-full">
        {/* Pie Chart */}
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Cash segment */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#7165e1"
              strokeWidth="20"
              strokeDasharray={`${cashPercentage * 2.51} 251.2`}
              strokeDashoffset="0"
            />
            {/* Cards segment */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#a855f7"
              strokeWidth="20"
              strokeDasharray={`${cardsPercentage * 2.51} 251.2`}
              strokeDashoffset={`-${cashPercentage * 2.51}`}
            />
            {/* UPI segment */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#c4b5fd"
              strokeWidth="20"
              strokeDasharray={`${upiPercentage * 2.51} 251.2`}
              strokeDashoffset={`-${(cashPercentage + cardsPercentage) * 2.51}`}
            />
          </svg>
          
          {/* Center labels */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-black">{data.cards}</span>
            <span className="text-sm text-gray-600">Cards</span>
          </div>
          
          {/* Side labels */}
          <div className="absolute top-4 right-0 text-right">
            <span className="text-lg font-semibold text-black">{data.cash}</span>
            <div className="text-xs text-gray-600">Cash</div>
          </div>
          
          <div className="absolute bottom-4 left-0">
            <span className="text-lg font-semibold text-black">{data.upi}</span>
            <div className="text-xs text-gray-600">UPI</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#7165e1] rounded"></div>
            <span className="text-gray-600">Cash</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#a855f7] rounded"></div>
            <span className="text-gray-600">Cards</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#c4b5fd] rounded"></div>
            <span className="text-gray-600">UPI</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}