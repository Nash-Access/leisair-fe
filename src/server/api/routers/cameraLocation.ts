import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAllCameraLocations, getOneCameraLocation } from "../mongo/collections/cameraLocations";


export const cameraLocationsRouter = createTRPCRouter({
    getOne: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return await getOneCameraLocation(input);
        }),

    getAll: publicProcedure
        .query(async () => {
            return await getAllCameraLocations();
        }),

});