"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserCheck, 
  FileText, 
  CreditCard, 
  Settings,
  ChevronDown,
  Building2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  userRole: 'SUPER_ADMIN' | 'ADMIN' | 'USER'
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ['SUPER_ADMIN', 'ADMIN', 'USER']
    },
    {
      name: "Appointments",
      href: "/appointments",
      icon: Calendar,
      roles: ['SUPER_ADMIN', 'ADMIN', 'USER']
    },
    {
      name: "Patients",
      href: "/patients",
      icon: Users,
      roles: ['SUPER_ADMIN', 'ADMIN', 'USER'],
      hasSubmenu: true,
      submenu: [
        { name: "All Patients", href: "/patients" },
        { name: "Add Patient", href: "/patients/add" }
      ]
    },
    {
      name: "Doctors",
      href: "/doctors",
      icon: UserCheck,
      roles: ['SUPER_ADMIN', 'ADMIN', 'USER']
    },
    {
      name: "Prescriptions",
      href: "/prescriptions",
      icon: FileText,
      roles: ['SUPER_ADMIN', 'ADMIN', 'USER']
    },
    {
      name: "Billing & Invoice",
      href: "/billing",
      icon: CreditCard,
      roles: ['SUPER_ADMIN', 'ADMIN', 'USER']
    },
    {
      name: "Clinics",
      href: "/clinics",
      icon: Building2,
      roles: ['SUPER_ADMIN']
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: FileText,
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ['SUPER_ADMIN', 'ADMIN', 'USER']
    }
  ]

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  )

  return (
    <aside className="w-[300px] bg-white h-full flex flex-col shadow-lg">
      {/* Logo */}
      <div className="flex items-center px-[24px] py-6">
        <div className="w-[40px] h-[40px] bg-[#7165e1] rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <h1 className="ml-3 font-extrabold text-[#7165e1] text-[22px] tracking-[-0.22px] font-tt-tricks">
          DigiGo Care
        </h1>
      </div>

      {/* Navigation */}
      <nav className="mt-[50px] px-[24px] space-y-3 flex-1">
        {filteredMenuItems.map((item) => (
          <div key={item.name}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center p-3 rounded-[16px] transition-all duration-200 hover:bg-[#7165e1]/10",
                pathname === item.href ? "bg-[#7165e1]" : ""
              )}
              onClick={() => item.hasSubmenu && toggleExpanded(item.name)}
            >
              <item.icon className="w-[28px] h-[28px]" />
              <span
                className={cn(
                  "ml-[24px] text-lg font-sf-pro font-semibold",
                  pathname === item.href ? "text-white" : "text-[#888888]"
                )}
              >
                {item.name}
              </span>
              {item.hasSubmenu && (
                <ChevronDown 
                  className={cn(
                    "ml-auto w-[24px] h-[24px] transition-transform",
                    expandedItems.includes(item.name) ? "rotate-180" : "",
                    pathname === item.href ? "text-white" : "text-[#888888]"
                  )}
                />
              )}
            </Link>
            
            {item.hasSubmenu && expandedItems.includes(item.name) && (
              <div className="ml-[52px] mt-2 space-y-2">
                {item.submenu?.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className={cn(
                      "block p-2 rounded-lg text-base font-sf-pro transition-colors",
                      pathname === subItem.href 
                        ? "bg-[#7165e1] text-white" 
                        : "text-[#888888] hover:bg-[#7165e1]/10"
                    )}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}