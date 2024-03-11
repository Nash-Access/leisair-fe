import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { deleteOneMLModel, getAllMLModels, getOneMLModel, selectDefaultMLModel, selectOneMLModel } from "../mongo/collections/mlModels";


export const mlModelRouter = createTRPCRouter({
    getOne: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return await getOneMLModel(input);
        }),

    getAll: publicProcedure
        .query(async () => {
            return await getAllMLModels();
        }),
    selectOne: publicProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
            return await selectOneMLModel(input);
        }),
    deleteOne: publicProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
            return await deleteOneMLModel(input);
        }),
    useDefault: publicProcedure
        .mutation(async () => {
            return await selectDefaultMLModel();
        }),
});