
import { Request, Response } from "express";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "./category.service.js";

import {
    createCategorySchema,
    updateCategorySchema,
    categoryQuerySchema,
    categoryIdSchema,
} from "./category.validation.js";

export async function getAll(
    req: Request,
    res: Response
) {
    const { type } = categoryQuerySchema.parse(req.query);

    const categories = await getCategories(
        req.user!.userId,
        type
    );

    return res.status(200).json({
        success: true,
        data: { categories },
    });
}

export async function create(
    req: Request,
    res: Response
) {
    const data = createCategorySchema.parse(req.body);

    const category = await createCategory(
        req.user!.userId,
        data
    );

    return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: { category },
    });
}

export async function update(
    req: Request,
    res: Response
) {
    const categoryId = categoryIdSchema.parse(req.params.id);
    const { name } = updateCategorySchema.parse(req.body);

    const category = await updateCategory(
        req.user!.userId,
        categoryId,
        name
    );

    return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: { category },
    });
}

export async function remove(
    req: Request,
    res: Response
) {
    const categoryId = categoryIdSchema.parse(req.params.id);

    const result = await deleteCategory(
        req.user!.userId,
        categoryId
    );

    return res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        data: result,
    });
}
