import { NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { posts } from "../../../lib/schema";

const db = drizzle(pool);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, content } = body;
    if (!title || !content)
      return NextResponse.json({ error: "title/content required" }, { status: 400 });

    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const result = await db
      .insert(posts)
      .values({
        title,
        content,
        slug,
        is_published: true,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
