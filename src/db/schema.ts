import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/* ---------------------------------- Auth ---------------------------------- */

export const userRole = pgEnum("user_role", ["admin", "customer"]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  name: text().notNull(),
  passwordHash: text().notNull(),
  role: userRole().notNull().default("customer"),
  ...timestamps,
});

export const sessions = pgTable(
  "sessions",
  {
    /** SHA-256 of the cookie token; the raw token is never stored. */
    id: text().primaryKey(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index().on(t.userId)],
);

/* --------------------------------- Catalog -------------------------------- */

export const categories = pgTable("categories", {
  id: uuid().primaryKey().defaultRandom(),
  slug: text().notNull().unique(),
  nameAr: text().notNull(),
  nameEn: text().notNull(),
  descriptionAr: text().notNull().default(""),
  descriptionEn: text().notNull().default(""),
  /** Key into the storefront's category icon set. */
  icon: text().notNull().default("sofa"),
  sortOrder: integer().notNull().default(0),
  isActive: boolean().notNull().default(true),
  ...timestamps,
});

export const products = pgTable(
  "products",
  {
    id: uuid().primaryKey().defaultRandom(),
    slug: text().notNull().unique(),
    sku: text().notNull().unique(),
    categoryId: uuid()
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    nameAr: text().notNull(),
    nameEn: text().notNull(),
    descriptionAr: text().notNull().default(""),
    descriptionEn: text().notNull().default(""),
    materialAr: text().notNull().default(""),
    materialEn: text().notNull().default(""),
    dimensions: text().notNull().default(""),
    /** Whole Egyptian pounds. */
    price: integer().notNull(),
    compareAtPrice: integer(),
    stock: integer().notNull().default(0),
    lowStockThreshold: integer().notNull().default(2),
    isFeatured: boolean().notNull().default(false),
    isActive: boolean().notNull().default(true),
    ...timestamps,
  },
  (t) => [index().on(t.categoryId)],
);

/* -------------------------------- Inventory ------------------------------- */

export const movementReason = pgEnum("movement_reason", [
  "restock",
  "sale",
  "return",
  "adjustment",
  "damage",
]);

/** Append-only ledger of stock changes; products.stock is the running total. */
export const inventoryMovements = pgTable(
  "inventory_movements",
  {
    id: uuid().primaryKey().defaultRandom(),
    productId: uuid()
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    delta: integer().notNull(),
    reason: movementReason().notNull(),
    note: text().notNull().default(""),
    createdBy: uuid().references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index().on(t.productId), index().on(t.createdAt)],
);

export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type MovementReason = (typeof movementReason.enumValues)[number];
