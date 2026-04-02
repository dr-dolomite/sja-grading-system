"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  UsersIcon,
  Settings2Icon,
  BuildingIcon,
  GraduationCapIcon,
} from "lucide-react"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string
    employeeId: string
    roles: string[]
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
      visible: true,
    },
    {
      title: "School Structure",
      url: "/dashboard/school-structure",
      icon: BuildingIcon,
      visible: user.roles.includes("ADMIN"),
    },
    {
      title: "Enrollment & Assignments",
      url: "/dashboard/enrollment",
      icon: GraduationCapIcon,
      visible: user.roles.includes("ADMIN") || user.roles.includes("PRINCIPAL"),
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: UsersIcon,
      visible: user.roles.includes("ADMIN"),
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2Icon,
      visible: true,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <Image
                  src="/sja-logos/sja-logo-transparent.png"
                  alt="SJA Logo"
                  width={24}
                  height={24}
                  className="size-5!"
                />
                <span className="text-base font-semibold">
                  SJA Grading System
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems
                .filter((item) => item.visible)
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
