export const dynamic = "force-dynamic";
import { appRouter } from "@/app/_trpc/routers";
import { pool } from "@/app/lib/db";
import Link from "next/link";

export default async function BlogPage() {
  const caller = appRouter.createCaller({ pool });
  const posts = await caller.posts.getAll();

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">All Posts</h1>
        <div className="flex gap-3">
          <Link href="/blog/categories" className="px-3 py-1 border rounded">
            Categories
          </Link>

          <a href="/blog/new" className="px-3 py-1 border rounded">
            + New Post
          </a>
        </div>
      </div>

      <ul className="space-y-4">
        {posts.map((p: any) => (
          <li key={p.id} className="border rounded p-4">
            <a
              href={`/blog/${p.slug}`}
              className="font-medium text-lg underline"
            >
              {p.title}
            </a>
            <p className="text-sm text-zinc-500 mt-1">
              {new Date(p.created_at).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
