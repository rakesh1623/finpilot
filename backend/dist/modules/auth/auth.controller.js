import { registerUser, loginUser, getUserById, } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
export async function register(req, res) {
    const validatedData = registerSchema.parse(req.body);
    const result = await registerUser(validatedData);
    return res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: result,
    });
}
export async function login(req, res) {
    const validatedData = loginSchema.parse(req.body);
    const result = await loginUser(validatedData);
    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
    });
}
export async function getMe(req, res) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }
    const user = await getUserById(req.user.userId);
    return res.status(200).json({
        success: true,
        data: { user },
    });
}
//# sourceMappingURL=auth.controller.js.map