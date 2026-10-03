import { count, countDistinct, eq, max } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client.js";
import { auction, bid } from "../db/schema.js";
import type { Tool } from "./types.js";

const parameters = z.object({
  auctionCode: z.number().int().describe("Auction code, e.g. 123"),
});

// Returns no rows when the auction does not exist. Visits is the auction's lifetime counter.
export const auctionStatsTool: Tool<typeof parameters> = {
  name: "getAuctionStats",
  description:
    "Statistics of one auction: title, total visits, total bids, unique bidders and highest bid.",
  parameters,
  run: ({ auctionCode }) =>
    db
      .select({
        code: auction.code,
        title: auction.title,
        visits: auction.visits,
        totalBids: count(bid.id),
        uniqueBidders: countDistinct(bid.userId),
        highestBid: max(bid.bid),
      })
      .from(auction)
      .leftJoin(bid, eq(bid.auctionId, auction.id))
      .where(eq(auction.code, auctionCode))
      .groupBy(auction.id),
};
