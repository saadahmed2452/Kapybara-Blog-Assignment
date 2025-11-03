// app/_trpc/routers/categories.ts
import { z } from "zod";
import { router, publicProcedure } from "../server";
import type { Context } from "../server";

export const categoriesRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { rows } = await ctx.pool.query(
      "SELECT id, name, description, slug FROM categories ORDER BY name ASC;"
    );
    return rows;
  }),

  getBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { rows } = await ctx.pool.query(
      `SELECT id, name, slug FROM categories WHERE slug = $1 LIMIT 1;`,
      [input]
    );
    return rows[0] ?? null;
  }),

  getPosts: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const { rows } = await ctx.pool.query(
      `
      SELECT p.id, p.title, p.slug, p.created_at
      FROM post_categories pc
      JOIN posts p ON p.id = pc.post_id
      WHERE pc.category_id = $1
      ORDER BY p.created_at DESC;
    `,
      [input]
    );
    return rows;
  }),

  getById: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const { rows } = await ctx.pool.query(
      "SELECT id, name, description, slug FROM categories WHERE id = $1 LIMIT 1;",
      [input]
    );
    return rows[0] ?? null;
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().nullable().optional(),
        slug: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { rows } = await ctx.pool.query(
        `INSERT INTO categories (name, description, slug)
        VALUES ($1, $2, $3) RETURNING id, name, description, slug;`,
        [input.name, input.description ?? null, input.slug]
      );
      return rows[0];
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        description: z.string().nullable().optional(),
        slug: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { rows } = await ctx.pool.query(
        `UPDATE categories SET name=$1, description=$2, slug=$3 WHERE id=$4
        RETURNING id, name, description, slug;`,
        [input.name, input.description ?? null, input.slug, input.id]
      );
      return rows[0] ?? null;
    }),

  delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    await ctx.pool.query("DELETE FROM post_categories WHERE category_id=$1;", [
      input,
    ]);
    const { rows } = await ctx.pool.query(
      "DELETE FROM categories WHERE id=$1 RETURNING id, name, slug;",
      [input]
    );
    return rows[0] ?? null;
  }),
});
