import EditPostClient from "./EditPostClient";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;  // <-- here await is required only in SERVER component
  return <EditPostClient slug={slug} />;
}
