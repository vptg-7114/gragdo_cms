"use client"

import { Card, CardContent } from "@/components/ui/card"

export function TreatmentClient() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1] mb-6">
        Treatment Management
      </h1>

      <Card className="rounded-[20px] border-none shadow-sm">
        <CardContent className="p-6 md:p-8 lg:p-12">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#7165e1] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">T</span>
            </div>
            <h2 className="text-xl md:text-2xl font-sf-pro font-semibold text-black mb-4">
              Treatment Module
            </h2>
            <p className="text-lg text-gray-500 font-sf-pro mb-6">
              Treatment management features will be implemented here
            </p>
            <p className="text-sm text-gray-400 font-sf-pro">
              This section will include treatment plans, protocols, and patient care management
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}