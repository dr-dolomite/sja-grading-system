import { verifySession } from "@/lib/dal"
import { DashboardSectionCards } from "@/components/dashboard-section-cards"

export default async function DashboardPage() {
  const session = await verifySession()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome to SJA Grading System
        </p>
      </div>
      <div className="px-4 lg:px-6">
        <DashboardSectionCards roles={session.roles} />
      </div>
    </div>
  )
}
