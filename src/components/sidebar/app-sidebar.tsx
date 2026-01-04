"use client"

import {
  BarChart3,
  LayoutDashboard,
  Package,
  Settings2,
  ShoppingCart,
  Tags,
  Users
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: Package,
      isActive: true,
      items: [
        {
          title: "All Products",
          url: "/admin/products",
        },
        {
          title: "Add Product",
          url: "/admin/products/new",
        },
      ],
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: Users,
    },
    {
      title: "Discounts",
      url: "/admin/discounts/coupons",
      isActive: true,
      icon: Tags,
      items: [
        {
          title: "Coupons",
          url: "/admin/discounts/coupons",
        },
        {
          title: "Add Coupon",
          url: "/admin/discounts/coupons/new",
        }
      ],
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: BarChart3,
      items: [
        {
          title: "Sales Report",
          url: "/admin/reports/sales",
        },
        {
          title: "Revenue",
          url: "/admin/reports/revenue",
        },
        {
          title: "Top Products",
          url: "/admin/reports/top-products",
        },
      ],
    },

  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <div className="size-8 text-primary">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                  </svg>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Bangle Co.</span>
                  <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
