import { NextResponse, NextRequest } from "next/server";
import { pool } from "../../../../lib/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { posts } from "../../../../lib/schema";
import { eq } from "drizzle-orm";

const db = drizzle(pool);

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;     // <<< IMPORTANT FIX
  const rows = await db.select().from(posts).where(eq(posts.slug, slug));
  return NextResponse.json(rows[0] ?? null);
}
