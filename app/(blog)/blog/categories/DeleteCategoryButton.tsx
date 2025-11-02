"use client";

import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

export default function DeleteCategoryButton({ id }: { id: number }) {
  const del = trpc.categories.delete.useMutation();
  const utils = trpc.useContext();
  const router = useRouter();

  const doDelete = async () => {
    if (!confirm("Delete this category ?")) return;
    await del.mutateAsync(id);
    utils.categories.invalidate();
    router.refresh();
  };

  return (
    <button
      onClick={doDelete}
      className="px-2 py-1 border border-red-500 text-red-600 rounded text-xs"
    >
      Delete
    </button>
  );
}
