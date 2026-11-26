import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
export async function getCategories(userId, type) {
    return prisma.category.findMany({
        where: {
            OR: [{ userId }, { userId: null }],
            ...(type && { type }),
        },
        select: {
            id: true,
            name: true,
            type: true,
            userId: true,
        },
        orderBy: { name: "asc" },
    });
}
export async function createCategory(userId, data) {
    const existing = await prisma.category.findFirst({
        where: {
            name: { equals: data.name, mode: "insensitive" },
            type: data.type,
            OR: [{ userId }, { userId: null }],
        },
    });
    if (existing) {
        throw new AppError(409, "Category already exists");
    }
    return prisma.category.create({
        data: {
            name: data.name,
            type: data.type,
            userId,
        },
    });
}
export async function updateCategory(userId, categoryId, name) {
    const category = await prisma.category.findFirst({
        where: { id: categoryId, userId },
    });
    if (!category) {
        throw new AppError(404, "Custom category not found");
    }
    const duplicate = await prisma.category.findFirst({
        where: {
            id: { not: categoryId },
            name: { equals: name, mode: "insensitive" },
            type: category.type,
            OR: [{ userId }, { userId: null }],
        },
    });
    if (duplicate) {
        throw new AppError(409, "Category name already exists");
    }
    return prisma.category.update({
        where: { id: categoryId, userId },
        data: { name },
    });
}
export async function deleteCategory(userId, categoryId) {
    const category = await prisma.category.findFirst({
        where: { id: categoryId, userId },
    });
    if (!category) {
        throw new AppError(404, "Custom category not found");
    }
    await prisma.category.delete({
        where: { id: categoryId, userId },
    });
    return { id: categoryId };
}
//# sourceMappingURL=category.service.js.map