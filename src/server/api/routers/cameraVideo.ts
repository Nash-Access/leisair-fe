import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAllCameraVideos, getCameraVideosByLocationId, getLowConfidenceDetections, getOneCameraVideo } from "../mongo/collections/cameraVideo";


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
    getAllLowConfidenceDetections: publicProcedure
        .input(z.number())
        .query(async ({ input }) => {
            const p = await getLowConfidenceDetections(input);
            console.log(p);
            return await getLowConfidenceDetections(input);
        }),

});