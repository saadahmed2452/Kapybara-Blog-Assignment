import { appRouter } from "@/app/_trpc/routers";
import { pool } from "@/app/lib/db";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const caller = appRouter.createCaller({ pool });

  // get category id by slug
  const category = await caller.categories.getBySlug(slug);
  if (!category) return notFound();

  // get posts under this category
  const posts = await caller.categories.getPosts(category.id);

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-6">
      <h1 className="text-2xl font-semibold">Category: {category.name}</h1>

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
