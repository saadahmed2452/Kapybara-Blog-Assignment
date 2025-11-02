import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { posts } from "../../../lib/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, content } = body;

    const slug = title.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");

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
