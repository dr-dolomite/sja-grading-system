"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { StudentTable } from "@/components/student-table"
import { CreateStudentSheet } from "@/components/create-student-sheet"
import { PlusIcon, UploadIcon } from "lucide-react"
import type { getEnrollmentData } from "@/app/actions/enrollment"

type EnrollmentData = Awaited<ReturnType<typeof getEnrollmentData>>

export function EnrollmentTabs(props: EnrollmentData) {
  const { students, gradeLevelEntries, sections } = props
  const [activeTab, setActiveTab] = useState("students")

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Enrollment &amp; Assignments</h1>
        </div>
        {activeTab === "students" && (
          <div className="flex items-center gap-2">
            <CreateStudentSheet
              mode="create"
              gradeLevelEntries={gradeLevelEntries}
              trigger={
                <Button>
                  <PlusIcon className="size-4 mr-2" />
                  Enroll Student
                </Button>
              }
            />
            <Button variant="outline">
              <UploadIcon className="size-4 mr-2" />
              Import CSV
            </Button>
          </div>
        )}
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full justify-start">
          <TabsTrigger
            value="students"
            className={activeTab === "students" ? "font-semibold" : ""}
          >
            Students
          </TabsTrigger>
          <TabsTrigger
            value="assignments"
            className={activeTab === "assignments" ? "font-semibold" : ""}
          >
            Assignments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="students" className="pt-4">
          <StudentTable
            students={students}
            gradeLevelEntries={gradeLevelEntries}
            sections={sections}
          />
        </TabsContent>
        <TabsContent value="assignments" className="pt-4">
          <div className="text-sm text-muted-foreground py-8 text-center">
            Assignments content — coming in the next plan.
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
