// app/_trpc/server.ts
import { initTRPC } from "@trpc/server";
import type { Pool } from "pg";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

// context type (for createCaller your existing createCaller({ pool }) will work)
export type Context = {
  pool: Pool;
};

// If you create an actual server adapter, set it up to pass pool into ctx:
export function createContext({ pool }: { pool: Pool }): Context {
  return { pool };
}
