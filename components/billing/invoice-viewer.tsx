"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Printer, Mail } from "lucide-react"

interface Invoice {
  id: string
  invoiceNo: string
  patientName: string
  phone: string
  createdDate: string
  dueDate: string
  amount: number
  status: 'Paid' | 'Pending' | 'Overdue'
  items: {
    description: string
    quantity: number
    rate: number
    amount: number
  }[]
}

interface InvoiceViewerProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice
}

export function InvoiceViewer({ isOpen, onClose, invoice }: InvoiceViewerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Overdue':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Implement download functionality
    console.log('Downloading invoice:', invoice.invoiceNo)
  }

  const handleEmail = () => {
    // Implement email functionality
    console.log('Emailing invoice:', invoice.invoiceNo)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl md:text-2xl font-sf-pro font-semibold text-[#7165e1]">
                Invoice {invoice.invoiceNo}
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Patient: {invoice.patientName}
              </p>
            </div>
            <Badge className={`rounded-full ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </Badge>
          </div>
        </DialogHeader>

        {/* Invoice Content */}
        <div className="space-y-6 py-6">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#7165e1] mb-2">DigiGo Care</h1>
              <p className="text-gray-600">Vishnu Clinic</p>
              <p className="text-gray-600">123 Health Street, Medical District</p>
              <p className="text-gray-600">Phone: +91-9876543210</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800">INVOICE</h2>
              <p className="text-gray-600">#{invoice.invoiceNo}</p>
              <p className="text-gray-600">Date: {invoice.createdDate}</p>
              <p className="text-gray-600">Due: {invoice.dueDate}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Bill To:</h3>
            <p className="font-semibold">{invoice.patientName}</p>
            <p className="text-gray-600">Phone: {invoice.phone}</p>
          </div>

          {/* Invoice Items */}
          <div className="border-t pt-6">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-semibold">Description</th>
                  <th className="text-center py-2 font-semibold">Qty</th>
                  <th className="text-right py-2 font-semibold">Rate</th>
                  <th className="text-right py-2 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">₹{item.rate.toFixed(2)}</td>
                    <td className="py-3 text-right">₹{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end border-t pt-6">
            <div className="w-64">
              <div className="flex justify-between py-2 text-xl font-bold">
                <span>Total:</span>
                <span>₹{invoice.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-6 text-center text-gray-600">
            <p>Thank you for your business!</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={handleEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload} className="bg-[#7165e1] hover:bg-[#5f52d1]">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}