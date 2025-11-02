import { NextResponse, NextRequest } from "next/server";
import { pool } from "../../lib/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { posts, postCategories } from "../../lib/schema";
import { desc, eq } from "drizzle-orm";

const db = drizzle(pool);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  try {
    if (!categoryId) {
      const rows = await db.select().from(posts).orderBy(desc(posts.created_at));
      return NextResponse.json(rows);
    } else {
      const catId = Number(categoryId);

      const rows = await db
        .select()
        .from(posts)
        .leftJoin(postCategories, eq(postCategories.post_id, posts.id))
        .where(eq(postCategories.category_id, catId))
        .orderBy(desc(posts.created_at));

      const result = rows.map(r => r.posts);
      return NextResponse.json(result);
    }
  } catch (err: any) {
    console.error("Error fetching posts:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
