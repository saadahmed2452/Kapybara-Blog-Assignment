"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";

export default function EditPostClient({ slug }: { slug: string }) {
  const router = useRouter();

  const { data: postData } = trpc.posts.getBySlug.useQuery(slug, {
    enabled: !!slug,
  });

  const { data: categories = [] } = trpc.categories.getAll.useQuery();
  const update = trpc.posts.update.useMutation();
  const utils = trpc.useContext();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (postData) {
      setTitle(postData.title);
      setContent(postData.content);
      setIsPublished(postData.is_published);

      utils.posts.getCategoriesOfPost.fetch(postData.id).then((cats) => {
        setSelectedCategories(cats.map((c: any) => c.id));
      });
    }
  }, [postData]);

  // ✅ FIX added
  const toggleCat = (id: number) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((cid) => cid !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postData) return;

    await update.mutateAsync({
      id: postData.id,
      title,
      content,
      is_published: isPublished,
      category_ids: selectedCategories,
    });

    utils.posts.invalidate();
    router.push(`/blog/${postData.slug}`);
  };

  if (!postData) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-6">
      <h1 className="text-2xl font-semibold">Edit Post</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border rounded px-3 py-2 min-h-[260px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={() => setIsPublished(!isPublished)}
          />
          Published
        </label>

        <div className="border rounded p-4 space-y-2">
          <div className="font-medium">Categories</div>
          <div className="flex gap-3 flex-wrap">
            {categories.map((cat: any) => (
              <label key={cat.id} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCat(cat.id)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        <button className="px-4 py-2 bg-black text-white rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
