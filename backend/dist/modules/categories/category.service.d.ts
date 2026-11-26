type CategoryType = "INCOME" | "EXPENSE";
export declare function getCategories(userId: string, type?: CategoryType): Promise<{
    id: string;
    name: string;
    type: import("../../../generated/prisma/index.js").$Enums.TransactionType;
    userId: string | null;
}[]>;
export declare function createCategory(userId: string, data: {
    name: string;
    type: CategoryType;
}): Promise<{
    id: string;
    userId: string | null;
    name: string;
    type: import("../../../generated/prisma/index.js").$Enums.TransactionType;
    createdAt: Date;
}>;
export declare function updateCategory(userId: string, categoryId: string, name: string): Promise<{
    id: string;
    userId: string | null;
    name: string;
    type: import("../../../generated/prisma/index.js").$Enums.TransactionType;
    createdAt: Date;
}>;
export declare function deleteCategory(userId: string, categoryId: string): Promise<{
    id: string;
}>;
export {};
