import { appRouter } from "@/app/_trpc/routers";
import { pool } from "@/app/lib/db";
import { notFound } from "next/navigation";
import EditCategoryClient from "./EditCategoryClient";

export default async function EditCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const caller = appRouter.createCaller({ pool });
  const cat = await caller.categories.getBySlug(slug);

  if (!cat) return notFound();

  return <EditCategoryClient category={cat} />;
}
