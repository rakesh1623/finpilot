import "dotenv/config";
export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    DATABASE_URL: string;
    FRONTEND_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    OPENAI_API_KEY: string;
    OPENAI_MODEL: string;
    OPENAI_VISION_MODEL: string;
};
