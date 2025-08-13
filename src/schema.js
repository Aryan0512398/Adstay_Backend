import { pgTable, serial, varchar, integer, text, timestamp, numeric, boolean, jsonb } from "drizzle-orm/pg-core";

// ===== Location Tables =====

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 10 }).notNull(),
});

export const states = pgTable("states", {
  id: serial("id").primaryKey(),
  country_id: integer("country_id").notNull().references(() => countries.id),
  name: varchar("name", { length: 100 }).notNull(),
});

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  state_id: integer("state_id").notNull().references(() => states.id),
  name: varchar("name", { length: 100 }).notNull(),
});

// ===== Users and Authentication =====

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 256 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(), // e.g., customer, vendor, admin, rm, branch_admin
  status: varchar("status", { length: 50 }).default("active"),
  created_at: timestamp("created_at").defaultNow(),
});

// ===== Vendors =====

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  business_type: varchar("business_type", { length: 50 }).notNull(), // hotel, restaurant, travel_agency
  kyc_status: varchar("kyc_status", { length: 50 }).default("pending"),
  documents: jsonb("documents"), // JSON string or URLs
  created_at: timestamp("created_at").defaultNow(),
});

// ===== Branches =====

export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  city_id: integer("city_id").notNull().references(() => cities.id),
  contact_info: varchar("contact_info", { length: 200 }),
});

// ===== Bookings =====

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  vendor_id: integer("vendor_id").notNull().references(() => vendors.id),
  type: varchar("type", { length: 50 }).notNull(), // hotel, restaurant, tour
  status: varchar("status", { length: 50 }).default("pending"), // pending, confirmed, cancelled
  booking_date: timestamp("booking_date").notNull(),
  payment_status: varchar("payment_status", { length: 50 }).default("pending"),
  created_at: timestamp("created_at").defaultNow(),
});

// ===== Reviews =====

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  vendor_id: integer("vendor_id").notNull().references(() => vendors.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  created_at: timestamp("created_at").defaultNow(),
});

// ===== Offers / Coupons =====

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  vendor_id: integer("vendor_id").notNull().references(() => vendors.id),
  code: varchar("code", { length: 50 }).notNull(),
  discount_percentage: integer("discount_percentage").notNull(),
  valid_from: timestamp("valid_from").notNull(),
  valid_to: timestamp("valid_to").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// ===== Complaints =====

export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  raised_by_user_id: integer("raised_by_user_id").notNull().references(() => users.id),
  vendor_id: integer("vendor_id").references(() => vendors.id),
  complaint_text: text("complaint_text").notNull(),
  status: varchar("status", { length: 50 }).default("open"), // open, in_progress, resolved
  escalated_to: integer("escalated_to"), // user_id of admin or RM
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// ===== Payment Methods =====

export const payment_methods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  card_number: varchar("card_number", { length: 20 }).notNull(),
  card_holder_name: varchar("card_holder_name", { length: 100 }).notNull(),
  expiry_date: varchar("expiry_date", { length: 10 }).notNull(),
  billing_address: varchar("billing_address", { length: 200 }),
  created_at: timestamp("created_at").defaultNow(),
});

//===== Payments =====
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  booking_id: integer("booking_id").references(() => bookings.id).notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  method: varchar("method", { length: 50 }).notNull(), // e.g., 'credit_card', 'upi', 'paypal'
  status: varchar("status", { length: 20 }).default("pending"), // pending, success, failed
  transaction_id: varchar("transaction_id", { length: 100 }), // from payment gateway
  created_at: timestamp("created_at").defaultNow(),
});
