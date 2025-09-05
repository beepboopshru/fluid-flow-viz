import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const saveSimulation = mutation({
  args: {
    name: v.string(),
    parameters: v.object({
      viscosity: v.number(),
      diffusion: v.number(),
      flowSpeed: v.number(),
      gridResolution: v.number(),
      stepSize: v.number(),
      visualizationMode: v.string(),
    }),
    shareId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    return await ctx.db.insert("simulations", {
      name: args.name,
      parameters: args.parameters,
      shareId: args.shareId,
      userId: user?._id,
      isPublic: !!args.shareId,
    });
  },
});

export const getSimulation = query({
  args: { shareId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("simulations")
      .withIndex("by_share_id", (q) => q.eq("shareId", args.shareId))
      .unique();
  },
});

export const getUserSimulations = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    
    return await ctx.db
      .query("simulations")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();
  },
});
