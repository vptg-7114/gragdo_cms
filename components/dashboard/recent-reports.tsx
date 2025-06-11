"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Download, Edit, FileText, MoreHorizontal } from "lucide-react"
import { formatDate } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Report {
  id: string
  title: string
  type: string
  generatedDate: Date
  size: string
  format: string
}

interface RecentReportsProps {
  reports: Report[]
}

export function RecentReports({ reports }: RecentReportsProps) {
  const handleDownload = (reportId: string) => {
    // Implement download functionality
    console.log('Downloading report:', reportId)
  }

  const handleEdit = (reportId: string) => {
    // Implement edit functionality
    console.log('Editing report:', reportId)
  }

  const getFormatColor = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-700'
      case 'excel':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <Card className="rounded-[20px] border-none shadow-sm">
      <CardContent className="p-4 md:p-6 lg:p-[34px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
            Recent Reports
          </h2>
          <Button
            variant="link"
            className="text-[#7165e1] text-sm md:text-base font-sf-pro font-medium"
          >
            View All
          </Button>
        </div>

        {reports.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              <ScrollArea className="h-[400px]">
                {reports.map((report) => (
                  <Card key={report.id} className="border border-gray-200 mb-4">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#7165e1] truncate">
                            {report.title}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {report.type}
                          </p>
                        </div>
                        <Badge
                          className={`rounded-full text-xs ml-2 ${getFormatColor(report.format)}`}
                        >
                          {report.format}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span>Generated:</span>
                          <span>{formatDate(report.generatedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>{report.size}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDownload(report.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(report.id)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </div>

            {/* Desktop List View */}
            <div className="hidden lg:block">
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 bg-[#f4f3ff] rounded-[10px] hover:bg-[#eeebff] transition-colors"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="w-10 h-10 bg-[#7165e1] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-sf-pro font-semibold text-black truncate">
                            {report.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{report.type}</span>
                            <span>•</span>
                            <span>{formatDate(report.generatedDate)}</span>
                            <span>•</span>
                            <span>{report.size}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-4">
                        <Badge
                          className={`rounded-full text-xs ${getFormatColor(report.format)}`}
                        >
                          {report.format}
                        </Badge>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDownload(report.id)}
                          >
                            <Download className="w-4 h-4 text-[#7165e1]" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(report.id)}
                          >
                            <Edit className="w-4 h-4 text-[#7165e1]" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-500 font-sf-pro">
              No reports found. Generate your first report to see it here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}