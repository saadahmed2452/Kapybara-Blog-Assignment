import EditPostClient from "./EditPostClient";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <EditPostClient slug={slug} />;
}
