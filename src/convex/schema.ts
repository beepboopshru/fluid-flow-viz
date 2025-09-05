import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    simulations: defineTable({
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
      userId: v.optional(v.id("users")),
      isPublic: v.boolean(),
    })
      .index("by_share_id", ["shareId"])
      .index("by_user_id", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;