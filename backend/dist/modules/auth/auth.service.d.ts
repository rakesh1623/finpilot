export declare function registerUser(data: {
    name: string;
    email: string;
    password: string;
}): Promise<{
    user: {
        createdAt: Date;
        email: string;
        id: string;
        name: string;
    };
    token: string;
}>;
export declare function loginUser(data: {
    email: string;
    password: string;
}): Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        createdAt: Date;
    };
    token: string;
}>;
export declare function getUserById(userId: string): Promise<{
    createdAt: Date;
    email: string;
    id: string;
    name: string;
}>;
