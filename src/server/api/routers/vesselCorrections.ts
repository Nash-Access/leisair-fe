import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAllVesselCorrections, getAllVesselCorrectionsWithoutImages, getOneVesselCorrection, getVesselCorrectionsByLocationId, insertVesselCorrection } from "../mongo/collections/vesselCorrections";


export const vesselCorrectionsRouter = createTRPCRouter({
    getOne: publicProcedure
        .input(z.any())
        .query(async ({ input }) => {
            return await getOneVesselCorrection(input);
        }),

    getAll: publicProcedure
        .query(async () => {
            return await getAllVesselCorrections();
        }),
    getAllWithoutImages: publicProcedure
        .query(async () => {
            return await getAllVesselCorrectionsWithoutImages();
        }),

    getAllByLocationId: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return await getVesselCorrectionsByLocationId(input);
        }),
    insertOne: publicProcedure
        .input(z.any())
        .mutation(async ({ input }) => {
            return await insertVesselCorrection(input);
        }),
});