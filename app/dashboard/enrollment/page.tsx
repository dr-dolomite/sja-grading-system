import { verifySession } from "@/lib/dal"
import { redirect } from "next/navigation"
import { getEnrollmentData } from "@/app/actions/enrollment"
import { getAssignmentData } from "@/app/actions/assignment"
import { EnrollmentTabs } from "@/components/enrollment-tabs"

export default async function EnrollmentPage() {
  const session = await verifySession()
  if (!session.roles.includes("ADMIN") && !session.roles.includes("PRINCIPAL")) {
    redirect("/dashboard")
  }

  const [enrollmentData, assignmentData] = await Promise.all([
    getEnrollmentData(),
    getAssignmentData(),
  ])
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <EnrollmentTabs enrollmentData={enrollmentData} assignmentData={assignmentData} />
      </div>
    </div>
  )
}
