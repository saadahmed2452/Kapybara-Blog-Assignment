import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "./routers"; // <--- IMPORTANT must point to routers index file not server.ts!!

export const trpc = createTRPCReact<AppRouter>();
