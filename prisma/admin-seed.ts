import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed =
    await bcrypt.hash(
      "123456",
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