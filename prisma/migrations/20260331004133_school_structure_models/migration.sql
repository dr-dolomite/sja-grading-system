-- CreateEnum
CREATE TYPE "GradeLevel" AS ENUM ('G7', 'G8', 'G9', 'G10', 'G11', 'G12');

-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('Q1', 'Q2', 'Q3', 'Q4');

-- CreateTable
CREATE TABLE "SchoolYear" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradingPeriod" (
    "id" TEXT NOT NULL,
    "schoolYearId" TEXT NOT NULL,
    "periodType" "PeriodType" NOT NULL,

    CONSTRAINT "GradingPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeLevelEntry" (
    "id" TEXT NOT NULL,
    "schoolYearId" TEXT NOT NULL,
    "gradeLevel" "GradeLevel" NOT NULL,

    CONSTRAINT "GradeLevelEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Strand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Strand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gradeLevelEntryId" TEXT NOT NULL,
    "strandId" TEXT,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subjectTypeKey" TEXT NOT NULL,
    "writtenWorkPct" INTEGER NOT NULL,
    "performanceTaskPct" INTEGER NOT NULL,
    "quarterlyAssessmentPct" INTEGER,
    "hasQuarterlyAssessment" BOOLEAN NOT NULL DEFAULT true,
    "linkedSubjectId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolYear_label_key" ON "SchoolYear"("label");

-- CreateIndex
CREATE UNIQUE INDEX "GradingPeriod_schoolYearId_periodType_key" ON "GradingPeriod"("schoolYearId", "periodType");

-- CreateIndex
CREATE UNIQUE INDEX "GradeLevelEntry_schoolYearId_gradeLevel_key" ON "GradeLevelEntry"("schoolYearId", "gradeLevel");

-- CreateIndex
CREATE UNIQUE INDEX "Strand_name_key" ON "Strand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Section_gradeLevelEntryId_name_key" ON "Section"("gradeLevelEntryId", "name");

-- AddForeignKey
ALTER TABLE "GradingPeriod" ADD CONSTRAINT "GradingPeriod_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeLevelEntry" ADD CONSTRAINT "GradeLevelEntry_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_gradeLevelEntryId_fkey" FOREIGN KEY ("gradeLevelEntryId") REFERENCES "GradeLevelEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_strandId_fkey" FOREIGN KEY ("strandId") REFERENCES "Strand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_linkedSubjectId_fkey" FOREIGN KEY ("linkedSubjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
