import { initTRPC } from "@trpc/server";
import type { Pool } from "pg";

export type Context = {
  pool: Pool;
};

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

export function createContext({ pool }: { pool: Pool }): Context {
  return { pool };
}
