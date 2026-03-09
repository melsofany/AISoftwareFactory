import { pgTable, serial, text, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Conversations table to store chat sessions
 */
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: serial("userId").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Messages table to store conversation messages
 */
export const roleMsgEnum = pgEnum("msg_role", ["user", "assistant"]);

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: serial("conversationId").notNull().references(() => conversations.id),
  role: roleMsgEnum("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Tasks table to store agent tasks
 */
export const statusEnum = pgEnum("status", ["pending", "running", "completed", "failed"]);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  conversationId: serial("conversationId").notNull().references(() => conversations.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: statusEnum("status").default("pending").notNull(),
  result: text("result"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Logs table to store execution logs
 */
export const levelEnum = pgEnum("level", ["info", "warning", "error", "debug"]);

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  taskId: serial("taskId").notNull().references(() => tasks.id),
  level: levelEnum("level").default("info").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Log = typeof logs.$inferSelect;
export type InsertLog = typeof logs.$inferInsert;