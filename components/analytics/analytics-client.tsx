"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  return (
    <>
      <h1 className="text-3xl font-sf-pro font-bold text-[#7165e1] mb-6">
        Analytics Dashboard
      </h1>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white rounded-2xl h-[54px]">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-[#7165e1] data-[state=active]:text-white rounded-2xl font-sf-pro font-semibold"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="financial" 
            className="data-[state=active]:bg-[#7165e1] data-[state=active]:text-white rounded-2xl font-sf-pro font-semibold"
          >
            Financial
          </TabsTrigger>
          <TabsTrigger 
            value="patients" 
            className="data-[state=active]:bg-[#7165e1] data-[state=active]:text-white rounded-2xl font-sf-pro font-semibold"
          >
            Patients
          </TabsTrigger>
          <TabsTrigger 
            value="performance" 
            className="data-[state=active]:bg-[#7165e1] data-[state=active]:text-white rounded-2xl font-sf-pro font-semibold"
          >
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="rounded-[20px] border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-sf-pro text-[#7165e1]">
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-2xl font-bold text-[#7165e1]">
                    ₹{initialData.revenue.thisMonth.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">This Month</p>
                  <p className={`text-sm mt-2 ${initialData.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {initialData.revenue.growth >= 0 ? '+' : ''}{initialData.revenue.growth}% vs Last Month
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[20px] border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-sf-pro text-[#7165e1]">
                  Patient Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-2xl font-bold text-green-600">
                    +{initialData.patients.growth}%
                  </p>
                  <p className="text-sm text-gray-500">vs Last Month</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Total: {initialData.patients.total} patients
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[20px] border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-sf-pro text-[#7165e1]">
                  Appointment Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-2xl font-bold text-blue-600">
                    {initialData.appointments.completionRate}%
                  </p>
                  <p className="text-sm text-gray-500">Completion Rate</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Total: {initialData.appointments.total} appointments
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <Card className="rounded-[20px] border-none shadow-sm">
            <CardContent className="p-[34px]">
              <div className="text-center py-12">
                <p className="text-lg text-gray-500 font-sf-pro">
                  Financial analytics charts will be implemented here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <Card className="rounded-[20px] border-none shadow-sm">
            <CardContent className="p-[34px]">
              <div className="text-center py-12">
                <p className="text-lg text-gray-500 font-sf-pro">
                  Patient analytics will be implemented here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="rounded-[20px] border-none shadow-sm">
            <CardContent className="p-[34px]">
              <div className="text-center py-12">
                <p className="text-lg text-gray-500 font-sf-pro">
                  Performance metrics will be implemented here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}