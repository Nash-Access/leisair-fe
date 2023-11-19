import { createTRPCRouter } from "~/server/api/trpc";
import { cameraLocationsRouter } from "./routers/cameraLocations";


export const appRouter = createTRPCRouter({
  cameraLocations: cameraLocationsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
