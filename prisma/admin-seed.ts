import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error("Set ADMIN_SEED_PASSWORD to a value of at least 12 characters.");
  }

  const hashed =
    await bcrypt.hash(
      password,
      10
    );

  await prisma.user.upsert({
    where: {
      email:
        "admin@gmail.com",
    },

    update: {},

    create: {
      name: "Admin",

      email:
        "admin@gmail.com",

      password: hashed,

      role: "ADMIN",
    },
  });

  console.log(
    "Admin created"
  );
}

main();