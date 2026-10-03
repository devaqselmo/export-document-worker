import {
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const reportExportStatus = pgEnum("ReportExportStatus", [
  "PENDING",
  "COMPLETED",
  "FAILED",
]);

export const reportExport = pgTable("ReportExport", {
  id: uuid("id").primaryKey(),
  requestedBy: text("requestedBy").notNull(),
  prompt: text("prompt").notNull(),
  format: text("format").notNull(),
  status: reportExportStatus("status").notNull().default("PENDING"),
  tool: text("tool"),
  params: jsonb("params"),
  s3Key: text("s3Key"),
  error: text("error"),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
  completedAt: timestamp("completedAt", { precision: 3 }),
});

// Only the columns the data tools read.
export const auction = pgTable("Auction", {
  id: text("id").primaryKey(),
  code: integer("code").notNull(),
  title: text("title").notNull(),
  visits: integer("visits").notNull(),
});

export const bid = pgTable("Bid", {
  id: text("id").primaryKey(),
  auctionId: text("auctionId").notNull(),
  bid: numeric("bid", { precision: 15, scale: 2 }).notNull(),
  userId: text("userId"),
});
