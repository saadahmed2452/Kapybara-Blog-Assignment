import { NextResponse, NextRequest } from "next/server"
import { pool } from "../../lib/db"
import { drizzle } from "drizzle-orm/node-postgres"
import { categories } from "../../lib/schema"

const db = drizzle(pool)   

export async function GET() {
  const rows = await db.select().from(categories).orderBy(categories.name)
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (!body?.name)
    return NextResponse.json({ error: "name required" }, { status: 400 })

  const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
const res = await db.insert(categories).values({
  name: body.name,
  slug,
  description: body.description ?? null
}).returning();


  return NextResponse.json(res[0])
}
