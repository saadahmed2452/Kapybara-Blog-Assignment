import { NextResponse } from "next/server";
import { db } from "../../lib/db";
import { posts } from "../../lib/schema";
import { desc } from "drizzle-orm";

export async function GET(req: Request) {
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
        .where(eq(posts.category_id, catId))
        .orderBy(desc(posts.created_at));
      return NextResponse.json(rows);
    }
  } catch (err: any) {
    console.error("Error fetching posts:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
