import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/app/_trpc/routers";
import { pool } from "@/app/_trpc/db";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({ pool }),
  });
};

export { handler as GET, handler as POST };
