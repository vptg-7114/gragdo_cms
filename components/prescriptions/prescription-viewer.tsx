"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  FileText, 
  Download, 
  Eye, 
  X,
  File,
  Image as ImageIcon,
  Printer
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  url: string
  size?: string
  uploadedAt?: Date
}

interface PrescriptionViewerProps {
  isOpen: boolean
  onClose: () => void
  documents: Document[]
  patientName: string
  type: 'reports' | 'prescriptions'
}

export function PrescriptionViewer({
  isOpen,
  onClose,
  documents,
  patientName,
  type
}: PrescriptionViewerProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const getFileIcon = (fileType: string) => {
    const lowerType = fileType.toLowerCase()
    if (lowerType.includes('pdf')) {
      return <FileText className="w-6 h-6 text-red-500" />
    } else if (lowerType.includes('doc')) {
      return <File className="w-6 h-6 text-blue-500" />
    } else if (lowerType.includes('image') || lowerType.includes('jpg') || lowerType.includes('png')) {
      return <ImageIcon className="w-6 h-6 text-green-500" />
    }
    return <File className="w-6 h-6 text-gray-500" />
  }

  const getFileTypeColor = (fileType: string) => {
    const lowerType = fileType.toLowerCase()
    if (lowerType.includes('pdf')) {
      return 'bg-red-100 text-red-700'
    } else if (lowerType.includes('doc')) {
      return 'bg-blue-100 text-blue-700'
    } else if (lowerType.includes('image') || lowerType.includes('jpg') || lowerType.includes('png')) {
      return 'bg-green-100 text-green-700'
    }
    return 'bg-gray-100 text-gray-700'
  }

  const handleDownload = (document: Document) => {
    // In a real application, this would trigger the actual download
    console.log('Downloading document:', document.name)
    // For demo purposes, we'll just show an alert
    alert(`Downloading ${document.name}...`)
  }

  const handleView = (document: Document) => {
    setSelectedDocument(document)
  }

  const handlePrint = () => {
    window.print()
  }

  // Mock prescription data for the professional layout
  const mockPrescriptionData = {
    doctor: {
      name: "Dr. Ch. Asritha",
      qualification: "MBBS, MS - Gynecology",
      clinic: "Clinic Name",
      email: "sample@gmail.com",
      phone: "9876543210"
    },
    patient: {
      name: "K. Vijay Kumar",
      age: 22,
      sex: "M",
      bloodGroup: "O +ve",
      date: "05-06-2025",
      time: "10:00 AM"
    },
    medications: [
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      }
    ]
  }

  const renderPrescriptionDocument = () => {
    return (
      <div className="w-full h-full bg-white p-8 overflow-auto">
        {/* Header with Doctor Info and Logo */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-200">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#7165e1] mb-2">
              {mockPrescriptionData.doctor.name}
            </h1>
            <p className="text-gray-600 mb-1">{mockPrescriptionData.doctor.qualification}</p>
            <p className="text-gray-600 mb-1">{mockPrescriptionData.doctor.clinic}</p>
            <p className="text-gray-600 mb-1">Email: {mockPrescriptionData.doctor.email}</p>
            <p className="text-gray-600">Phone No: {mockPrescriptionData.doctor.phone}</p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 text-2xl font-bold text-[#7165e1]">
              <div className="w-8 h-8 bg-[#7165e1] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">D</span>
              </div>
              DigiGo Care
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Patient Name</h2>
          <h3 className="text-xl font-bold text-gray-900 mb-4">{mockPrescriptionData.patient.name}</h3>
          
          <div className="grid grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Age</span>
              <p className="font-semibold">{mockPrescriptionData.patient.age}</p>
            </div>
            <div>
              <span className="text-gray-600">Sex</span>
              <p className="font-semibold">{mockPrescriptionData.patient.sex}</p>
            </div>
            <div>
              <span className="text-gray-600">Blood Group</span>
              <p className="font-semibold">{mockPrescriptionData.patient.bloodGroup}</p>
            </div>
            <div>
              <span className="text-gray-600">Date</span>
              <p className="font-semibold">{mockPrescriptionData.patient.date}</p>
            </div>
            <div>
              <span className="text-gray-600">Time</span>
              <p className="font-semibold">{mockPrescriptionData.patient.time}</p>
            </div>
          </div>
        </div>

        {/* Prescription Table */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#7165e1] mb-4">Rx</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Medicine</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Content</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Price</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Dosage</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Usage</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Days</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Qty</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Advice</th>
                </tr>
              </thead>
              <tbody>
                {mockPrescriptionData.medications.map((medication, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 text-sm">{medication.medicine}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{medication.content}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{medication.price}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{medication.dosage}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{medication.usage}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{medication.days}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{medication.qty}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{medication.advice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button 
            onClick={() => handleDownload(selectedDocument!)}
            className="bg-[#7165e1] hover:bg-[#5f52d1] flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>
    )
  }

  const renderDocumentPreview = () => {
    if (!selectedDocument) return null

    const fileType = selectedDocument.type.toLowerCase()
    
    // For prescription documents, show the professional prescription layout
    if (type === 'prescriptions') {
      return renderPrescriptionDocument()
    }
    
    // For reports, show the original preview logic
    if (fileType.includes('pdf')) {
      return (
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700 mb-2">{selectedDocument.name}</p>
            <p className="text-sm text-gray-500 mb-4">PDF Document</p>
            <Button 
              onClick={() => handleDownload(selectedDocument)}
              className="bg-[#7165e1] hover:bg-[#5f52d1]"
            >
              <Download className="w-4 h-4 mr-2" />
              Download to View
            </Button>
          </div>
        </div>
      )
    } else if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png')) {
      return (
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700 mb-2">{selectedDocument.name}</p>
            <p className="text-sm text-gray-500 mb-4">Image File</p>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline"
                onClick={() => alert('Opening image viewer...')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Image
              </Button>
              <Button 
                onClick={() => handleDownload(selectedDocument)}
                className="bg-[#7165e1] hover:bg-[#5f52d1]"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <File className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700 mb-2">{selectedDocument.name}</p>
            <p className="text-sm text-gray-500 mb-4">Document File</p>
            <Button 
              onClick={() => handleDownload(selectedDocument)}
              className="bg-[#7165e1] hover:bg-[#5f52d1]"
            >
              <Download className="w-4 h-4 mr-2" />
              Download to View
            </Button>
          </div>
        </div>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-7xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl md:text-2xl font-sf-pro font-semibold text-[#7165e1]">
            {type === 'reports' ? 'Patient Reports' : 'Prescriptions'} - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full">
          {/* Document List Sidebar */}
          <div className="w-1/4 border-r bg-gray-50">
            <div className="p-4 border-b bg-white">
              <h3 className="font-semibold text-gray-800">
                {type === 'reports' ? 'Reports' : 'Prescription Documents'} ({documents.length})
              </h3>
            </div>
            
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {documents.length > 0 ? (
                  documents.map((document) => (
                    <div
                      key={document.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDocument?.id === document.id
                          ? 'bg-[#7165e1] text-white border-[#7165e1]'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => handleView(document)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {getFileIcon(document.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm truncate ${
                            selectedDocument?.id === document.id ? 'text-white' : 'text-gray-800'
                          }`}>
                            {document.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              className={`text-xs ${
                                selectedDocument?.id === document.id 
                                  ? 'bg-white/20 text-white' 
                                  : getFileTypeColor(document.type)
                              }`}
                            >
                              {document.type.toUpperCase()}
                            </Badge>
                            {document.size && (
                              <span className={`text-xs ${
                                selectedDocument?.id === document.id ? 'text-white/80' : 'text-gray-500'
                              }`}>
                                {document.size}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          variant={selectedDocument?.id === document.id ? "secondary" : "outline"}
                          className="flex-1 h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleView(document)
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedDocument?.id === document.id ? "secondary" : "outline"}
                          className="flex-1 h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(document)
                          }}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No {type === 'reports' ? 'reports' : 'prescription documents'} available
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Document Preview Area */}
          <div className="flex-1">
            {selectedDocument ? (
              <div className="h-full">
                {type === 'prescriptions' ? (
                  // For prescriptions, show full-width professional layout
                  renderDocumentPreview()
                ) : (
                  // For reports, show with header
                  <>
                    <div className="flex items-center justify-between p-6 border-b">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{selectedDocument.name}</h4>
                        <p className="text-sm text-gray-500">
                          {selectedDocument.type} • {selectedDocument.size || 'Unknown size'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(selectedDocument)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDocument(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="h-[calc(100%-80px)] p-6">
                      {renderDocumentPreview()}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 mb-2">Select a document to preview</p>
                  <p className="text-sm text-gray-500">
                    Choose a {type === 'reports' ? 'report' : 'prescription document'} from the list to view or download
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}