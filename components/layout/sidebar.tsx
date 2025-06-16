"use client"

import { useState, useEffect } from "react"
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
  X,
  Users2,
  Receipt,
  Activity,
  Bed,
  Pill
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
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(false)
        setIsOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen)
    } else {
      setIsCollapsed(!isCollapsed)
      if (!isCollapsed) {
        setExpandedItems([])
      }
    }
  }

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  // Admin menu items
  const adminMenuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      roles: ['ADMIN']
    },
    {
      name: "Patients",
      href: "/admin/patients",
      icon: Users,
      roles: ['ADMIN']
    },
    {
      name: "Doctors",
      href: "/admin/doctors",
      icon: UserCheck,
      roles: ['ADMIN']
    },
    {
      name: "Staffs",
      href: "/admin/staffs",
      icon: Users2,
      roles: ['ADMIN']
    },
    {
      name: "Appointments",
      href: "/admin/appointments",
      icon: Calendar,
      roles: ['ADMIN']
    },
    {
      name: "Rooms",
      href: "/admin/rooms",
      icon: Bed,
      roles: ['ADMIN']
    },
    {
      name: "Medicine",
      href: "/admin/medicine",
      icon: Pill,
      roles: ['ADMIN']
    },
    {
      name: "Transactions",
      href: "/admin/transactions",
      icon: Receipt,
      roles: ['ADMIN']
    },
    {
      name: "Prescription",
      href: "/admin/prescriptions",
      icon: FileText,
      roles: ['ADMIN']
    },
    {
      name: "Treatment",
      href: "/admin/treatment",
      icon: Activity,
      roles: ['ADMIN']
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: FileText,
      roles: ['ADMIN']
    },
    //   {
    //   name: "Clinics",
    //   href: "/admin/clinics",
    //   icon: Building2,
    //   roles: ['SUPER_ADMIN','ADMIN']
    // },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      roles: ['SUPER_ADMIN', 'ADMIN']
    }
  ]

  // Staff menu items (existing)
  const staffMenuItems = [
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
      // hasSubmenu: true,
      // submenu: [
      //   { name: "All Patients", href: "/patients" },
      //   { name: "Add Patient", href: "/patients/add" }
      // ]
    },
    {
      name: "Doctors",
      href: "/doctors",
      icon: UserCheck,
      roles: ['SUPER_ADMIN', 'ADMIN', 'USER']
    },
    {
      name: "Rooms",
      href: "/rooms",
      icon: Bed,
      roles: ['SUPER_ADMIN', 'ADMIN', 'USER']
    },
    {
      name: "Medicine",
      href: "/medicine",
      icon: Pill,
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
      name: "Analytics",
      href: "/analytics",
      icon: FileText,
      roles: ['SUPER_ADMIN', 'ADMIN', 'USER']
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ['SUPER_ADMIN', 'ADMIN', 'USER']
    }
  ]

  // Determine which menu items to show based on current path
  const isAdminPath = pathname.startsWith('/admin')
  const menuItems = isAdminPath ? adminMenuItems : staffMenuItems
  
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  )

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 bg-white shadow-md border hover:bg-gray-50"
        >
          <Menu className="h-5 w-5 text-[#7165e1]" />
        </Button>

        {/* Mobile Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileSidebar}
          />
        )}

        {/* Mobile Sidebar */}
        <aside className={cn(
          "fixed left-0 top-0 h-full w-[280px] bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobileSidebar}
            className="absolute right-4 top-4 h-8 w-8"
          >
            <X className="h-4 w-4 text-[#7165e1]" />
          </Button>

          {/* Logo */}
          <div className="flex items-center px-6 py-6 mt-8">
            <div className="w-[40px] h-[40px] bg-[#7165e1] rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="ml-3 font-extrabold text-[#7165e1] text-[20px] tracking-[-0.22px] font-tt-tricks">
              DigiGo Care
            </h1>
          </div>

          {/* Navigation */}
          <nav className="px-6 space-y-2 flex-1 overflow-y-auto">
            {filteredMenuItems.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center p-3 rounded-[12px] transition-all duration-200 hover:bg-[#7165e1]/10",
                    pathname === item.href ? "bg-[#7165e1]" : ""
                  )}
                  onClick={() => {
                    if (item.hasSubmenu) {
                      toggleExpanded(item.name)
                    } else {
                      closeMobileSidebar()
                    }
                  }}
                >
                  <item.icon className="w-[24px] h-[24px]" />
                  <span
                    className={cn(
                      "ml-4 text-base font-sf-pro font-semibold",
                      pathname === item.href ? "text-white" : "text-[#888888]"
                    )}
                  >
                    {item.name}
                  </span>
                  {item.hasSubmenu && (
                    <ChevronDown 
                      className={cn(
                        "ml-auto w-[20px] h-[20px] transition-transform",
                        expandedItems.includes(item.name) ? "rotate-180" : "",
                        pathname === item.href ? "text-white" : "text-[#888888]"
                      )}
                    />
                  )}
                </Link>
                
                {item.hasSubmenu && expandedItems.includes(item.name) && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.submenu?.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "block p-2 rounded-lg text-sm font-sf-pro transition-colors",
                          pathname === subItem.href 
                            ? "bg-[#7165e1] text-white" 
                            : "text-[#888888] hover:bg-[#7165e1]/10"
                        )}
                        onClick={closeMobileSidebar}
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
      </>
    )
  }

  return (
    <aside className={cn(
      "bg-white h-full flex flex-col shadow-lg transition-all duration-300 ease-in-out relative hidden md:flex",
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