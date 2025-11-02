import { appRouter } from "@/app/_trpc/routers";
import { pool } from "@/app/lib/db";
import DeleteCategoryButton from "./DeleteCategoryButton"; // we'll implement next

export default async function CategoriesPage() {
  const caller = appRouter.createCaller({ pool });
  const cats = await caller.categories.getAll();

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">All Categories</h1>

        <a
          href="/blog/categories/new"
          className="px-3 py-1 border rounded text-sm"
        >
          + New Category
        </a>
      </div>

      <ul className="space-y-4">
        {cats.map((c: any) => (
          <li
            key={c.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-zinc-500">{c.slug}</div>
            </div>

            <div className="flex gap-3 items-center">
              <a
                href={`/blog/categories/${c.slug}`}
                className="underline text-sm"
              >
                View Posts
              </a>
              <a
                href={`/blog/categories/${c.slug}/edit`}
                className="px-2 py-1 border rounded text-xs"
              >
                Edit
              </a>
              <DeleteCategoryButton id={c.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
