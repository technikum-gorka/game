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
    database: pool,
    user: {
        additionalFields: {
            skin: {
                type: "string",
                defaultValue: 'red',
            },
            power: {
                type: 'number',
                defaultValue: 1
            },
            agility: {
                type: 'number',
                defaultValue: 1
            },
            condition: {
                type: 'number',
                defaultValue: 1
            },
            intelligence: {
                type: 'number',
                defaultValue: 1
            },
            wisdom: {
                type: 'number',
                defaultValue: 1
            },
            charisma: {
                type: 'number',
                defaultValue: 1
            },
        }
    }
});