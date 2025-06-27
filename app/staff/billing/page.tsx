import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { InvoicesClient } from "@/components/billing/invoices-client"
import { getInvoices } from "@/lib/actions/billing"

export default async function StaffBillingPage() {
  const invoices = await getInvoices()

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="STAFF" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <InvoicesClient initialInvoices={invoices} />
        </div>
      </main>
    </div>
  )
}