"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";

export default function NewPostPage() {
  const router = useRouter();
  const utils = trpc.useContext();

  const { data: categories = [] } = trpc.categories.getAll.useQuery();
  const create = trpc.posts.create.useMutation();
  const assignCats = trpc.posts.assignCategories.useMutation({
    onSuccess: async () => {
      await utils.posts.invalidate();
      router.push("/blog");
    },
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const toggleCategory = (id: number) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const post = await create.mutateAsync({
      title,
      content,
      is_published: true,
      category_ids: selectedCategories,
    });

    if (selectedCategories.length > 0) {
      await assignCats.mutateAsync({
        postId: post.id,
        categoryIds: selectedCategories,
      });
    } else {
      await utils.posts.invalidate();
      router.push("/blog");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create New Post</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border rounded px-3 py-2 min-h-[280px]"
          placeholder="Write markdown content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {/* categories selection */}
        <div className="border rounded p-4 space-y-2">
          <div className="font-medium">Select Categories</div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat: any) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="px-4 py-2 rounded bg-black text-white">
          Publish
        </button>
      </form>
    </div>
  );
}
