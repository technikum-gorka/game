import { createPool } from "mysql2/promise";
import { Kysely, MysqlDialect } from "kysely";
import type { User } from "@/lib/types";

export const pool = createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

export interface Database {
    user: User;
}

export const db = new Kysely<Database>({
    dialect: new MysqlDialect({ pool: pool.pool }),
});