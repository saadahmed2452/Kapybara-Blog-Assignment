import { router } from "../server";
import { postsRouter } from "./posts";
import { categoriesRouter } from "./categories";
import { postCategoriesRouter } from "./postCategories";  // ✅ add this

export const appRouter = router({
  posts: postsRouter,
  categories: categoriesRouter,
  postCategories: postCategoriesRouter, // ✅ add this
});

export type AppRouter = typeof appRouter;
