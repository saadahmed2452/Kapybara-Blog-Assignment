import { pool } from "../../../lib/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { posts, postCategories } from "../../../lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

const db = drizzle(pool);

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;   // MUST AWAIT
  const rows = await db.select().from(posts).where(eq(posts.id, Number(id)));
  return NextResponse.json(rows[0] ?? null);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  const body = await req.json();

  if (!body?.title || !body?.content)
    return NextResponse.json({ error: "title/content required" }, { status: 400 });

  const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  await db.update(posts).set({
    title: body.title,
    content: body.content,
    slug,
    is_published: !!body.is_published,
    updated_at: new Date()
  }).where(eq(posts.id, postId));

  await db.delete(postCategories).where(eq(postCategories.post_id, postId));

  if (Array.isArray(body.categories) && body.categories.length > 0) {
    for (const catId of body.categories) {
      await db.insert(postCategories).values({ post_id: postId, category_id: catId });
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  await db.delete(postCategories).where(eq(postCategories.post_id, postId));
  await db.delete(posts).where(eq(posts.id, postId));
  return NextResponse.json({ success: true });
}
