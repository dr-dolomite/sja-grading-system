import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await bcrypt.hash("Admin@1234", 12)
  await prisma.user.upsert({
    where: { employeeId: "admin" },
    update: {},
    create: {
      employeeId: "admin",
      name: "System Administrator",
      passwordHash,
      roles: ["ADMIN"],
      mustChangePassword: true,
    },
  })
  console.log("Seed complete.")
  console.log("  Employee ID: admin")
  console.log("  Password: Admin@1234")
  console.log("  (Must change password on first login)")

  // Seed default strands (D-20)
  const defaultStrands = ["STEM", "ABM", "HUMSS", "GAS"]
  for (const name of defaultStrands) {
    await prisma.strand.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log("Seeded default strands: STEM, ABM, HUMSS, GAS")
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
