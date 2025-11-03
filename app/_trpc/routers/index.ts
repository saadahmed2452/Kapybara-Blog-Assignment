import { router } from "../server";
import { postsRouter } from "./posts";
import { categoriesRouter } from "./categories";
import { postCategoriesRouter } from "./postCategories";

export const appRouter = router({
  posts: postsRouter,
  categories: categoriesRouter,
  postCategories: postCategoriesRouter,
});


export type AppRouter = typeof appRouter;
