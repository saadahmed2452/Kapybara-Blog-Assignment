import { appRouter } from "@/app/_trpc/routers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { pool } from "@/app/_trpc/db";

export const { GET, POST } = fetchRequestHandler({
  endpoint: "/api/trpc",
  router: appRouter,
  createContext() {
    return { pool };
  },
});
