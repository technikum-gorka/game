import { betterAuth } from "better-auth";
import { pool } from "./database";
 
export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        }, 
    },
    database: pool
});