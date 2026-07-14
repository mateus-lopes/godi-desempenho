import "dotenv/config";
import bcrypt from "bcrypt";
import { db, pool } from "../src/db/client";
import { users } from "../src/db/schema/users";

const email = "admin@admin.com";
const password = "admin";

const passwordHash = await bcrypt.hash(password, 10);

await db.insert(users).values({ email, passwordHash }).onConflictDoNothing();

console.log(`Usuário criado: ${email} / ${password}`);
await pool.end();
