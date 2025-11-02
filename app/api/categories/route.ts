import { NextResponse } from "next/server";
import db from "../../lib/db";
import { categories } from "../../lib/schema";

export async function GET() {
  const rows = await db.select().from(categories).orderBy(categories.name.asc);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.name)
    return NextResponse.json({ error: "name required" }, { status: 400 });
  const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const res = await db.insert(categories).values({
    name: body.name,
    description: body.description ?? null,
    slug
  }).returning();
  return NextResponse.json(res[0]);
}
