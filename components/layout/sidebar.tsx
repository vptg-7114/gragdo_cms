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
  Building2,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  userRole: 'SUPER_ADMIN' | 'ADMIN' | 'USER'
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
    // Close all expanded items when collapsing
    if (!isCollapsed) {
      setExpandedItems([])
    }
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
    <aside className={cn(
      "bg-white h-full flex flex-col shadow-lg transition-all duration-300 ease-in-out relative",
      isCollapsed ? "w-[80px]" : "w-[300px]"
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={cn(
          "absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-white shadow-md border hover:bg-gray-50",
          "flex items-center justify-center"
        )}
      >
        {isCollapsed ? (
          <Menu className="h-3 w-3 text-[#7165e1]" />
        ) : (
          <X className="h-3 w-3 text-[#7165e1]" />
        )}
      </Button>

      {/* Logo */}
      <div className={cn(
        "flex items-center px-[24px] py-6 transition-all duration-300",
        isCollapsed && "px-[20px] justify-center"
      )}>
        <div className="w-[40px] h-[40px] bg-[#7165e1] rounded-lg flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <h1 className="ml-3 font-extrabold text-[#7165e1] text-[22px] tracking-[-0.22px] font-tt-tricks transition-opacity duration-300">
            DigiGo Care
          </h1>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "mt-[50px] px-[24px] space-y-3 flex-1 transition-all duration-300",
        isCollapsed && "px-[20px]"
      )}>
        {filteredMenuItems.map((item) => (
          <div key={item.name}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center p-3 rounded-[16px] transition-all duration-200 hover:bg-[#7165e1]/10 group",
                pathname === item.href ? "bg-[#7165e1]" : "",
                isCollapsed && "justify-center"
              )}
              onClick={() => item.hasSubmenu && !isCollapsed && toggleExpanded(item.name)}
            >
              <item.icon className="w-[28px] h-[28px] flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span
                    className={cn(
                      "ml-[24px] text-lg font-sf-pro font-semibold transition-opacity duration-300",
                      pathname === item.href ? "text-white" : "text-[#888888]"
                    )}
                  >
                    {item.name}
                  </span>
                  {item.hasSubmenu && (
                    <ChevronDown 
                      className={cn(
                        "ml-auto w-[24px] h-[24px] transition-transform duration-200",
                        expandedItems.includes(item.name) ? "rotate-180" : "",
                        pathname === item.href ? "text-white" : "text-[#888888]"
                      )}
                    />
                  )}
                </>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-[90px] bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
            
            {/* Submenu */}
            {item.hasSubmenu && !isCollapsed && expandedItems.includes(item.name) && (
              <div className="ml-[52px] mt-2 space-y-2 transition-all duration-300">
                {item.submenu?.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className={cn(
                      "block p-2 rounded-lg text-base font-sf-pro transition-colors duration-200",
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