
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";

const SALT_ROUNDS = 12;

function generateToken(userId: string) {
    return jwt.sign(
        { sub: userId },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );
}

export async function registerUser(data: {
    name: string;
    email: string;
    password: string;
}) {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new AppError(409, "Email is already registered");
    }

    const passwordHash = await bcrypt.hash(
        data.password,
        SALT_ROUNDS
    );

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            passwordHash,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });

    const token = generateToken(user.id);

    return { user, token };
}

export async function loginUser(data: {
    email: string;
    password: string;
}) {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new AppError(401, "Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(
        data.password,
        user.passwordHash
    );

    if (!passwordMatches) {
        throw new AppError(401, "Invalid email or password");
    }

    const token = generateToken(user.id);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        },
        token,
    };
}

export async function getUserById(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    return user;
}
