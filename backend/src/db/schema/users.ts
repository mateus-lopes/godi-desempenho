import { pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRoleEnum("role").default('user').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
