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
  Image as ImageIcon
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

  const renderDocumentPreview = () => {
    if (!selectedDocument) return null

    const fileType = selectedDocument.type.toLowerCase()
    
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
      <DialogContent className="w-[95vw] max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl md:text-2xl font-sf-pro font-semibold text-[#7165e1]">
            {type === 'reports' ? 'Patient Reports' : 'Prescriptions'} - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full">
          {/* Document List Sidebar */}
          <div className="w-1/3 border-r bg-gray-50">
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
          <div className="flex-1 p-6">
            {selectedDocument ? (
              <div className="h-full">
                <div className="flex items-center justify-between mb-4">
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
                
                <div className="h-[calc(100%-80px)]">
                  {renderDocumentPreview()}
                </div>
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