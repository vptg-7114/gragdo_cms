"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RevenueChart() {
  // Mock data for the bar chart
  const chartData = [
    { day: 'Jun 1', income: 40000, expense: 20000 },
    { day: 'Jun 2', income: 35000, expense: 18000 },
    { day: 'Jun 3', income: 42000, expense: 22000 },
    { day: 'Jun 4', income: 30000, expense: 15000 },
    { day: 'Jun 5', income: 38000, expense: 19000 },
    { day: 'Jun 6', income: 36000, expense: 17000 },
    { day: 'Jun 7', income: 33000, expense: 16000 },
  ]

  const maxValue = 40000

  return (
    <Card className="rounded-[20px] border-none shadow-sm h-[400px]">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-sf-pro font-semibold text-black">
          Revenue
        </CardTitle>
        <div className="text-2xl font-bold text-[#7165e1]">
          ₹ 2,50,000
        </div>
      </CardHeader>
      <CardContent>
        {/* Y-axis labels */}
        <div className="flex items-start mb-4">
          <div className="flex flex-col justify-between h-48 text-xs text-gray-500 mr-4">
            <span>40000</span>
            <span>30000</span>
            <span>20000</span>
            <span>10000</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="flex-1">
            <div className="relative h-48 flex items-end justify-between gap-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex gap-1 items-end flex-1 max-w-[60px]">
                  {/* Income bar */}
                  <div 
                    className="bg-[#7165e1] rounded-t flex-1"
                    style={{ 
                      height: `${(data.income / maxValue) * 192}px`,
                      minWidth: '12px'
                    }}
                  />
                  {/* Expense bar */}
                  <div 
                    className="bg-[#c4b5fd] rounded-t flex-1"
                    style={{ 
                      height: `${(data.expense / maxValue) * 192}px`,
                      minWidth: '12px'
                    }}
                  />
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
            <span className="text-gray-600">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#c4b5fd] rounded"></div>
            <span className="text-gray-600">Expense</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}