import db from "../app/lib/db";
import { categories, posts, post_categories } from "../app/lib/schema";

async function seed() {
  console.log("Seeding...");
  await db.insert(categories).values([
    { name: "Tech", description: "Technology", slug: "tech" },
    { name: "Design", description: "Design stuff", slug: "design" }
  ]).onConflictDoNothing();

  await db.insert(posts).values([
    {
      title: "Welcome to the Blog",
      content: "# Hello 👋\nThis is your first post!",
      slug: "welcome-to-the-blog",
      is_published: true
    }
  ]).onConflictDoNothing();

  console.log("Done!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
