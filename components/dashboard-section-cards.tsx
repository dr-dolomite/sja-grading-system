import Link from "next/link"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  UsersIcon,
  BookOpenIcon,
  SchoolIcon,
  ClipboardListIcon,
  FileTextIcon,
} from "lucide-react"

const roleSections = [
  {
    role: "ADMIN",
    title: "User Management",
    description: "Create and manage user accounts, assign roles, reset passwords.",
    icon: UsersIcon,
    link: "/dashboard/users",
    linkLabel: "Manage users",
    available: true,
  },
  {
    role: "SUBJECT_TEACHER",
    title: "My Subjects",
    description: "View and manage your assigned subjects and student grades.",
    icon: BookOpenIcon,
    link: null,
    linkLabel: null,
    available: false,
  },
  {
    role: "ADVISER",
    title: "My Section",
    description: "Manage your advisory section, attendance, and student records.",
    icon: SchoolIcon,
    link: null,
    linkLabel: null,
    available: false,
  },
  {
    role: "PRINCIPAL",
    title: "School Overview",
    description: "Monitor school-wide grades, teacher activity, and assignments.",
    icon: ClipboardListIcon,
    link: null,
    linkLabel: null,
    available: false,
  },
  {
    role: "REGISTRAR",
    title: "Grade Records",
    description: "Access student grades and records across all sections.",
    icon: FileTextIcon,
    link: null,
    linkLabel: null,
    available: false,
  },
]

export function DashboardSectionCards({ roles }: { roles: string[] }) {
  const visibleSections = roleSections.filter((section) =>
    roles.includes(section.role),
  )

  if (visibleSections.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No dashboard sections available for your role.
      </p>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {visibleSections.map((section) => (
        <Card key={section.role}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <section.icon className="size-5 text-muted-foreground" />
              <CardTitle className="text-xl font-semibold">
                {section.title}
              </CardTitle>
            </div>
            <CardDescription>
              {section.available
                ? section.description
                : `${section.title} \u2014 available in a later phase.`}
            </CardDescription>
          </CardHeader>
          {section.available && section.link && (
            <div className="px-6 pb-6">
              <Button asChild variant="default" size="sm">
                <Link href={section.link}>{section.linkLabel}</Link>
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
