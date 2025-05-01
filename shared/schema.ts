import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: text("is_admin").notNull().default("false"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Report schema
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  incidentType: text("incident_type").notNull(),
  location: text("location").notNull(),
  date: text("date").notNull(),
  time: text("time"),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Note schema for admin notes on reports
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  reportId: serial("report_id").notNull().references(() => reports.id),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact form submission schema
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true 
});

export const insertReportSchema = createInsertSchema(reports).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true 
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
