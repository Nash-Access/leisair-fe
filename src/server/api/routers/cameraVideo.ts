import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { deleteAllCameraVideos, getAllCameraVideos, getAllCameraVideosWithoutFramesProjection, getCameraVideosByLocationId, getLowConfidenceDetections, getOneCameraVideo } from "../mongo/collections/cameraVideo";
import { deleteAllVideoStatuses } from "../mongo/collections/videoStatus";
import axios from "axios";
import { env } from "~/env.mjs";
import { ObjectId } from "mongodb";


export const cameraVideoRouter = createTRPCRouter({
    getOne: publicProcedure
        .input(z.any())
        .query(async ({ input }) => {
            return await getOneCameraVideo(input);
        }),

    getAll: publicProcedure
        .query(async () => {
            return await getAllCameraVideosWithoutFramesProjection();
        }),
    getAllByLocationId: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return await getCameraVideosByLocationId(input);
        }),
    getAllLowConfidenceDetections: publicProcedure
        .input(z.number())
        .query(async ({ input }) => {
            return await getLowConfidenceDetections(input);
        }),
    deleteAll: publicProcedure
        .mutation(async () => {
            await deleteAllCameraVideos()
            await deleteAllVideoStatuses()
            const reponse  = await axios.post(`${env.BACKEND_API_URL}/deleteAll`)
            if (reponse.status !== 200) {
                throw new Error("Failed to delete all camera videos")
            }
            return "Deleted all camera videos"
        }),
});