// app/_trpc/routers/posts.ts
import { z } from "zod";
import { router, publicProcedure } from "../server";

/**
 * simple slugify helper (keeps deps minimal)
 */
function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word chars
    .replace(/\s+/g, "-") // spaces -> dashes
    .replace(/-+/g, "-"); // collapse dashes
}

export const postsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // ctx.pool was provided by createContext in route.ts
    const { rows } = await ctx.pool.query(
      `SELECT id, title, content, slug, is_published, created_at, updated_at FROM posts ORDER BY created_at DESC;`
    );
    return rows;
  }),

  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { rows } = await ctx.pool.query(
        `SELECT id, title, content, slug, is_published, created_at, updated_at FROM posts WHERE slug = $1 LIMIT 1;`,
        [input]
      );
      return rows[0] ?? null;
    }),

create: publicProcedure
  .input(
    z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      is_published: z.boolean().optional().default(false),
      category_ids: z.array(z.number()).default([]) // <--- added
    })
  )
  .mutation(async ({ ctx, input }) => {
    const slugBase = slugify(input.title);
    let slug = slugBase;
    let i = 1;
    while (true) {
      const { rows } = await ctx.pool.query(`SELECT id FROM posts WHERE slug = $1 LIMIT 1;`, [slug]);
      if (rows.length === 0) break;
      slug = `${slugBase}-${i++}`;
    }

    const { rows } = await ctx.pool.query(
      `INSERT INTO posts (title, content, slug, is_published, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, title, content, slug, is_published, created_at, updated_at;`,
      [input.title, input.content, slug, input.is_published]
    );
    const post = rows[0];

    // insert category relations
    if (input.category_ids.length > 0) {
      for (const cid of input.category_ids) {
        await ctx.pool.query(
          `INSERT INTO post_categories (post_id, category_id) VALUES ($1, $2);`,
          [post.id, cid]
        );
      }
    }

    return post;
  }),
update: publicProcedure
  .input(
    z.object({
      id: z.number(),
      title: z.string().min(1),
      content: z.string().min(1),
      is_published: z.boolean().optional().default(false),
      category_ids: z.array(z.number()).default([])
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.pool.query(
      `UPDATE posts SET title=$1, content=$2, is_published=$3, updated_at=NOW() WHERE id=$4`,
      [input.title, input.content, input.is_published, input.id]
    );

    // wipe old categories
    await ctx.pool.query(`DELETE FROM post_categories WHERE post_id=$1`, [input.id]);

    // insert new
    if (input.category_ids.length > 0) {
      await ctx.pool.query(
        `INSERT INTO post_categories (post_id, category_id)
        SELECT $1, unnest($2::int[])
        ON CONFLICT (post_id, category_id) DO NOTHING;`,
        [input.id, input.category_ids]
      );
    }

    return { success: true };
  }),

  delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
  const { rows } = await ctx.pool.query(`DELETE FROM posts WHERE id=$1 RETURNING id;`, [input]);
  return rows[0] ?? null;
}),



    getCategoriesOfPost: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const { rows } = await ctx.pool.query(`
        SELECT categories.id, categories.name, categories.slug
        FROM post_categories
        JOIN categories ON categories.id = post_categories.category_id
        WHERE post_categories.post_id = $1
      `, [input]);
      return rows;
    }),

  assignCategories: publicProcedure
  .input(
    z.object({
      postId: z.number(),
      categoryIds: z.array(z.number())
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.pool.query(
      `INSERT INTO post_categories (post_id, category_id)
       SELECT $1, unnest($2::int[])
       ON CONFLICT (post_id, category_id) DO NOTHING;`,
      [input.postId, input.categoryIds]
    );

    return { success: true };
  }),


})
