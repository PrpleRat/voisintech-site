import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const latest = await prisma.quoteRequest.findFirst({
  orderBy: { createdAt: "desc" },
});

console.log(JSON.stringify(latest, null, 2));
await prisma.$disconnect();
