/**
 * APP SIDEBAR COMPONENT
 * 
 * Purpose: Main navigation sidebar for all dashboard routes
 * Features:
 * - Role-aware menu items (shows different nav based on user role)
 * - Active route highlighting
 * - User profile dropdown with logout
 * - Collapsible sidebar on mobile
 * - Dynamic routing prefixes (/admin, /manager, /technician)
 * 
 * Role-Based Navigation:
 * 
 * ADMIN Navigation:
 * - Dashboard → /admin
 * - Equipment → /admin/equipment
 * - Teams → /admin/teams
 * - Users → /admin/users
 * - Requests → /admin/requests
 * - Calendar → /admin/calendar
 * - Reports → /admin/reports
 * 
 * MANAGER Navigation:
 * - Dashboard → /manager
 * - Equipment → /manager/equipment
 * - Teams → /manager/teams
 * - Requests → /manager/requests
 * - Calendar → /manager/calendar
 * - Reports → /manager/reports
 * 
 * TECHNICIAN Navigation:
 * - Dashboard → /technician
 * - Requests → /technician/requests
 * - Calendar → /technician/calendar
 * 
 * Component Structure:
 * <Sidebar>
 *   ├── <Header> (Logo + Title)
 *   ├── <SidebarContent>
 *   │   └── <RoleBasedMenu /> (Dynamically rendered items)
 *   └── <Footer>
 *       └── <UserDropdown /> (Profile + Logout)
 */

"use client"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboardIcon,
  WrenchIcon,
  ClipboardListIcon,
  CalendarIcon,
  BarChart3Icon,
  SettingsIcon,
  UserIcon,
  LogOutIcon,
  UsersIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getRole, getUser, logout as authLogout } from "@/lib/auth"

/**
 * Navigation item type
 */
interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  roles?: ('admin' | 'manager' | 'technician')[] // If empty, show for all roles
}

/**
 * Admin navigation items
 * Complete system management access
 */
const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboardIcon,
    roles: ['admin'],
  },
  {
    title: "Equipment",
    url: "/admin/equipment",
    icon: WrenchIcon,
    roles: ['admin'],
  },
  {
    title: "Teams",
    url: "/admin/teams",
    icon: UsersIcon,
    roles: ['admin'],
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: UserIcon,
    roles: ['admin'],
  },
  {
    title: "Requests",
    url: "/admin/requests",
    icon: ClipboardListIcon,
    roles: ['admin'],
  },
  {
    title: "Calendar",
    url: "/admin/calendar",
    icon: CalendarIcon,
    roles: ['admin'],
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: BarChart3Icon,
    roles: ['admin'],
  },
]

const managerNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/manager",
    icon: LayoutDashboardIcon,
    roles: ['manager'],
  },
  {
    title: "Equipment",
    url: "/manager/equipment",
    icon: WrenchIcon,
    roles: ['manager'],
  },
  {
    title: "Teams",
    url: "/manager/teams",
    icon: UsersIcon,
    roles: ['manager'],
  },
  {
    title: "Requests",
    url: "/manager/requests",
    icon: ClipboardListIcon,
    roles: ['manager'],
  },
  {
    title: "Calendar",
    url: "/manager/calendar",
    icon: CalendarIcon,
    roles: ['manager'],
  },
  {
    title: "Reports",
    url: "/manager/reports",
    icon: BarChart3Icon,
    roles: ['manager'],
  },
]

const technicianNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/technician",
    icon: LayoutDashboardIcon,
    roles: ['technician'],
  },
  {
    title: "Requests",
    url: "/technician/requests",
    icon: ClipboardListIcon,
    roles: ['technician'],
  },
  {
    title: "Calendar",
    url: "/technician/calendar",
    icon: CalendarIcon,
    roles: ['technician'],
  },
]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'technician' | null>(null)
  const [userData, setUserData] = useState<ReturnType<typeof getUser>>(null)
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const role = getRole()
    setUserRole(role)
    setUserData(getUser())

    // Select navigation items based on role
    switch (role) {
      case 'admin':
        setNavItems(adminNavItems)
        break
      case 'manager':
        setNavItems(managerNavItems)
        break
      case 'technician':
        setNavItems(technicianNavItems)
        break
      default:
        setNavItems([])
    }
    
    // Mark as mounted to avoid hydration mismatch
    setMounted(true)
  }, [])

  /**
   * Handle user logout
   * Clear authentication data and redirect to login
   */
  const handleLogout = () => {
    authLogout()
    router.replace('/login')
  }

  return (
    <Sidebar collapsible="icon">
      {/* ========== HEADER ========== */}
      <SidebarHeader className="h-16 border-b border-sidebar-border/50 px-6 flex mt-5">
        <Link
          href={
            userRole === 'admin'
              ? '/admin'
              : userRole === 'manager'
                ? '/manager'
                : '/technician'
          }
          className="flex items-center gap-3 font-semibold group-data-[collapsible=icon]:hidden"
        >
          <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
            <WrenchIcon className="size-5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            GearGuard
          </span>
        </Link>
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
          <WrenchIcon className="size-6 text-primary" />
        </div>
      </SidebarHeader>

      {/* ========== NAVIGATION MENU ========== */}
      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url || pathname.startsWith(item.url + '/')}
                tooltip={item.title}
                className="hover:bg-sidebar-accent transition-all duration-200"
              >
                <Link href={item.url}>
                  <item.icon className="size-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* ========== USER FOOTER ========== */}
      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {/* USER AVATAR */}
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                    <AvatarFallback className="rounded-lg">
                      {mounted ? (userData?.full_name?.substring(0, 2).toUpperCase() || 'U') : 'U'}
                    </AvatarFallback>
                  </Avatar>

                  {/* USER INFO (Hidden when collapsed) */}
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-1">
                    <span className="truncate font-semibold">
                      {mounted ? (userData?.full_name || 'User') : 'User'}
                    </span>
                    {/* USER ROLE BADGE */}
                    <span className="truncate text-xs text-sidebar-foreground/70 capitalize">
                      {mounted ? (userRole || 'Unknown') : 'Unknown'}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              {/* USER DROPDOWN MENU */}
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="right"
                align="end"
                sideOffset={4}
              >
                {/* USER PROFILE INFO */}
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{mounted ? (userData?.full_name || 'User') : 'User'}</p>
                  <p className="text-xs text-muted-foreground">{mounted ? (userData?.email || '') : ''}</p>
                  <p className="text-xs text-muted-foreground capitalize mt-1">
                    Role: <span className="font-medium">{mounted ? (userRole || 'Unknown') : 'Unknown'}</span>
                  </p>
                </div>

                <DropdownMenuSeparator />

                {/* PROFILE LINK */}
                <DropdownMenuItem className="gap-2">
                  <UserIcon className="size-4" />
                  Profile
                </DropdownMenuItem>

                {/* SETTINGS LINK (Admin only) */}
                {userRole === 'admin' && (
                  <DropdownMenuItem className="gap-2">
                    <SettingsIcon className="size-4" />
                    System Settings
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {/* LOGOUT BUTTON */}
                <DropdownMenuItem
                  className="gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOutIcon className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
