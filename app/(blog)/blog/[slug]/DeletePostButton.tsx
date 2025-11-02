"use client";

import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

export function DeletePostButton({ id }: { id: number }) {
  const router = useRouter();
  const del = trpc.posts.delete.useMutation();   // <--- this is correct
  const utils = trpc.useUtils();

  const doDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    await del.mutateAsync(id);

    await utils.posts.getAll.invalidate();   // <--- correct query invalidate

    router.push("/blog");
  };

  return (
    <button
      onClick={doDelete}
      className="px-2 py-1 bg-red-600 text-white text-xs rounded"
    >
      Delete
    </button>
  );
}
