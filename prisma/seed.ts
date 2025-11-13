// prisma/seed.ts
import { PrismaClient, Role } from "../src/generated/prisma";
import * as bcrypt from "bcryptjs";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

const db = prisma;

async function main() {
  console.log(`Start seeding ...`);

  // Əgər bu email-də istifadəçi varsa, heç nə etmə
  const existingAdmin = await db.user.findUnique({
    where: { email: "togruleminov3@gmail.com" },
  });

  if (existingAdmin) {
    console.log("Admin user already exists.");
    return;
  }

  // Parolu hash edirik
  const hashedPassword = await bcrypt.hash("Togrul12345()", 10);

  // Yeni admin istifadəçisi yaradırıq
  const adminUser = await db.user.create({
    data: {
      username: "togruleminov",
      name: "Togrul Eminov",
      email: "togruleminov3@gmail.com",
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log(`Created admin user with id: ${adminUser.id}`);
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
