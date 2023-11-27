import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAllCameraLocations, getOneCameraLocation } from "../mongo/collections/cameraLocations";
import { getAllCameraVideos, getCameraVideosByLocationId, getOneCameraVideo } from "../mongo/collections/cameraVideo";


export const cameraVideoRouter = createTRPCRouter({
    getOne: publicProcedure
        .input(z.any())
        .query(async ({ input }) => {
            return await getOneCameraVideo(input);
        }),

    getAll: publicProcedure
        .query(async () => {
            return await getAllCameraVideos();
        }),
    getAllByLocationId: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return await getCameraVideosByLocationId(input);
        }),

});