import { verifySession } from "@/lib/dal"
import { redirect } from "next/navigation"
import { getSchoolStructureData } from "@/app/actions/school-structure"
import { SchoolStructureTabs } from "@/components/school-structure-tabs"

export default async function SchoolStructurePage() {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN")) {
    redirect("/dashboard")
  }

  const data = await getSchoolStructureData()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <SchoolStructureTabs {...data} />
      </div>
    </div>
  )
}
