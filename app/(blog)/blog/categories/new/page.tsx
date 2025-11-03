"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";

export default function NewCategoryPage() {
  const router = useRouter();
  const create = trpc.categories.create.useMutation();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create.mutateAsync({ name, slug });
    router.push("/blog/categories");
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-6">
      <h1 className="text-2xl font-semibold">New Category</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Category name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="slug..."
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />

        <button className="px-4 py-2 bg-black text-white rounded">
          Create Category
        </button>
      </form>
    </div>
  );
}
