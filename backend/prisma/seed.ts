
/// <reference types="node" />

import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const categories = [
    { name: "Food", type: "EXPENSE" },
    { name: "Rent", type: "EXPENSE" },
    { name: "Shopping", type: "EXPENSE" },
    { name: "Transport", type: "EXPENSE" },
    { name: "Groceries", type: "EXPENSE" },
    { name: "Entertainment", type: "EXPENSE" },
    { name: "Healthcare", type: "EXPENSE" },
    { name: "Utilities", type: "EXPENSE" },
    { name: "Other Expense", type: "EXPENSE" },
    { name: "Salary", type: "INCOME" },
    { name: "Freelance", type: "INCOME" },
    { name: "Investments", type: "INCOME" },
    { name: "Other Income", type: "INCOME" },
] as const;

async function main() {
    for (const category of categories) {
        const existing = await prisma.category.findFirst({
            where: {
                name: category.name,
                type: category.type,
                userId: null,
            },
        });

        if (!existing) {
            await prisma.category.create({
                data: {
                    name: category.name,
                    type: category.type,
                    userId: null,
                },
            });
        }
    }

    console.log("Default categories seeded");
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
