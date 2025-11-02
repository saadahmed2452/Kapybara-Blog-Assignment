import { appRouter } from "@/app/_trpc/routers";
import { pool } from "@/app/lib/db";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { DeletePostButton } from "./DeletePostButton";
import Link from "next/link";

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const caller = appRouter.createCaller({ pool });

  const post = await caller.posts.getBySlug(slug);
  if (!post) return notFound();

  const cats = await caller.posts.getCategoriesOfPost(post.id);

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <div className="flex gap-3">
          <Link
            href={`/blog/${post.slug}/edit`}
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
          >
            Edit
          </Link>
          <DeletePostButton id={post.id} />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mt-2">
        {cats.map((c: any) => (
          <a
            key={c.id}
            href={`/blog/categories/${c.slug}`}
            className="px-2 py-1 bg-zinc-200 rounded text-xs font-medium"
          >
            {c.name}
          </a>
        ))}
      </div>

      <div className="text-sm text-zinc-500">
        {new Date(post.created_at).toLocaleDateString()}
      </div>

      <div className="prose whitespace-pre-wrap">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}
