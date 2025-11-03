import { appRouter } from "./routers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { pool } from "@/app/_trpc/db";
import type { Context } from "./server";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext(): Context {
      return { pool };
    },
  });
};

export { handler as GET, handler as POST };
