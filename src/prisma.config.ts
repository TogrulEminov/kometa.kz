import { config } from "dotenv";
import { defineConfig } from "@prisma/config";
config();
export default defineConfig({
  // Path to your Prisma schema
  schema: "./prisma/schema.prisma",

  // Optional: where migrations are stored
  migrations: {
    path: "./prisma/migrations",
  },
});
