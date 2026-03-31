"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SchoolYearTab } from "@/components/school-year-tab"
import { CreateSchoolYearSheet } from "@/components/create-school-year-sheet"
import { GradeLevelsTab } from "@/components/grade-levels-tab"
import type { getSchoolStructureData } from "@/app/actions/school-structure"

type SchoolStructureData = Awaited<ReturnType<typeof getSchoolStructureData>>

export function SchoolStructureTabs(props: SchoolStructureData) {
  const { schoolYears, gradeLevelEntries, strands } = props
  const [activeTab, setActiveTab] = useState("school-year")

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">School Structure</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage school years, grade levels, sections, and subjects.
          </p>
        </div>
        {activeTab === "school-year" && <CreateSchoolYearSheet />}
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full justify-start">
          <TabsTrigger
            value="school-year"
            className={activeTab === "school-year" ? "font-semibold" : ""}
          >
            School Year
          </TabsTrigger>
          <TabsTrigger
            value="grade-levels"
            className={activeTab === "grade-levels" ? "font-semibold" : ""}
          >
            Grade Levels
          </TabsTrigger>
          <TabsTrigger
            value="subjects"
            className={activeTab === "subjects" ? "font-semibold" : ""}
          >
            Subjects
          </TabsTrigger>
        </TabsList>
        <TabsContent value="school-year" className="mt-4">
          <SchoolYearTab schoolYears={schoolYears} />
        </TabsContent>
        <TabsContent value="grade-levels" className="mt-4">
          <GradeLevelsTab
            gradeLevelEntries={gradeLevelEntries}
            strands={strands}
          />
        </TabsContent>
        <TabsContent value="subjects" className="mt-4">
          <div className="text-sm text-muted-foreground">
            Subjects tab content
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
