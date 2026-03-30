import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/dal"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // IMPORTANT: getCurrentUser() here is for DISPLAY DATA ONLY (name, roles for sidebar).
  // This is NOT an auth gate. Layouts do not re-render on client-side navigation
  // (Next.js Partial Rendering — see RESEARCH.md Pitfall 5), so this check would
  // not re-verify the session on navigation between dashboard routes.
  // Auth gating happens in: (1) proxy.ts for every request, and
  // (2) verifySession() called independently in each page component and Server Action.
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        user={{
          name: user.name,
          employeeId: user.employeeId,
          roles: user.roles as string[],
        }}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
