"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function DailyRevenueReport() {
  // Mock data for the chart
  const chartData = [
    { month: 'Jan-1', income: 30000, expense: 20000 },
    { month: 'Jan-2', income: 35000, expense: 25000 },
    { month: 'Jan-3', income: 40000, expense: 30000 },
    { month: 'Jan-4', income: 32000, expense: 22000 },
    { month: 'Jan-5', income: 38000, expense: 28000 },
    { month: 'Jan-6', income: 42000, expense: 32000 },
    { month: 'Jan-7', income: 36000, expense: 26000 },
  ]

  return (
    <Card className="rounded-[20px] border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-sf-pro font-semibold text-black">
            Daily Revenue Report
          </h3>
          <Button variant="link" className="text-[#7165e1] text-sm font-sf-pro font-medium p-0">
            View more
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-3xl font-bold text-[#7165e1] mb-2">₹ 2,50,000</p>
        </div>

        {/* Simple Bar Chart */}
        <div className="h-40 flex items-end justify-between gap-2 mb-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col items-center gap-1">
                <div 
                  className="w-4 bg-[#7165e1] rounded-t"
                  style={{ height: `${(data.income / 50000) * 100}px` }}
                />
                <div 
                  className="w-4 bg-purple-300 rounded-t"
                  style={{ height: `${(data.expense / 50000) * 80}px` }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2">{data.month}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#7165e1] rounded"></div>
            <span className="text-gray-600">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-300 rounded"></div>
            <span className="text-gray-600">Expense</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}