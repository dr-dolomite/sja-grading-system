-- DropIndex
DROP INDEX "Section_gradeLevelEntryId_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Section_gradeLevelEntryId_name_strandId_key" ON "Section"("gradeLevelEntryId", "name", "strandId");
