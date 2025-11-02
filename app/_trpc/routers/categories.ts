// app/_trpc/routers/categories.ts
import { z } from "zod";
import { router, publicProcedure } from "../server";
import type { Pool } from "pg";
import pkg from "pg";
const { Pool: _Pool } = pkg;

// input shapes
const CategoryCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  slug: z.string().min(1),
});

const CategoryUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  slug: z.string().min(1),
});

export const categoriesRouter = router({
getAll: publicProcedure.query(async ({ ctx }) => {
  const pool: Pool = ctx.pool;
  const { rows } = await pool.query(
    "SELECT id, name, description, slug FROM categories ORDER BY name ASC;"
  );
  return rows;
}),

  getBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
  const { rows } = await ctx.pool.query(`SELECT id, name, slug FROM categories WHERE slug = $1 LIMIT 1;`, [input]);
  return rows[0] ?? null;
}),

getPostsByCategory: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
  const { rows } = await ctx.pool.query(`
    SELECT p.id, p.title, p.slug, p.created_at
    FROM post_categories pc
    JOIN posts p ON p.id = pc.post_id
    WHERE pc.category_id = $1
    ORDER BY p.created_at DESC;
  `, [input]);
  return rows;
}),


getPosts: publicProcedure
  .input(z.number())
  .query(async ({ ctx, input }) => {
    const { rows } = await ctx.pool.query(`
      SELECT posts.id, posts.title, posts.slug, posts.created_at
      FROM post_categories
      JOIN posts ON posts.id = post_categories.post_id
      WHERE post_categories.category_id = $1
      ORDER BY posts.created_at DESC
    `, [input]);
    return rows;
  }),


  getById: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const pool: Pool = ctx.pool;
    const { rows } = await pool.query(
      "SELECT id, name, description, slug FROM categories WHERE id = $1 LIMIT 1;",
      [input]
    );
    return rows[0] ?? null;
  }),

  create: publicProcedure.input(CategoryCreateSchema).mutation(async ({ input, ctx }) => {
    const pool: Pool = ctx.pool;
    const { name, description = null, slug } = input;
    const { rows } = await pool.query(
      `INSERT INTO categories (name, description, slug)
       VALUES ($1, $2, $3) RETURNING id, name, description, slug;`,
      [name, description, slug]
    );
    return rows[0];
  }),

  update: publicProcedure.input(CategoryUpdateSchema).mutation(async ({ input, ctx }) => {
    const pool: Pool = ctx.pool;
    const { id, name, description = null, slug } = input;
    const { rows } = await pool.query(
      `UPDATE categories SET name = $1, description = $2, slug = $3 WHERE id = $4
       RETURNING id, name, description, slug;`,
      [name, description, slug, id]
    );
    return rows[0] ?? null;
  }),

  delete: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const pool: Pool = ctx.pool;
    await pool.query("DELETE FROM post_categories WHERE category_id = $1;", [input]);
    const { rows } = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING id, name, slug;",
      [input]
    );
    return rows[0] ?? null;
  }),
});
