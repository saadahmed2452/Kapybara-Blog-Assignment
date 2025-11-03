"use client";

import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

export default function EditCategoryClient({ category }: { category: any }) {
  const router = useRouter();
  const update = trpc.categories.update.useMutation();
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [desc, setDesc] = useState(category.description ?? "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await update.mutateAsync({
      id: category.id,
      name,
      slug,
      description: desc,
    });
    router.push("/blog/categories");
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-6">
      <h1 className="text-2xl font-semibold">Edit Category</h1>

      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Slug..."
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />

        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Description..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <button className="px-4 py-2 bg-black text-white rounded">Save</button>
      </form>
    </div>
  );
}
