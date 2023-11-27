import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAllVideoStatuses, getOneVideoStatus } from "../mongo/collections/videoStatus";


export const videoStatusRouter = createTRPCRouter({
    getOne: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return await getOneVideoStatus(input);
        }),

    getAll: publicProcedure
        .query(async () => {
            return await getAllVideoStatuses();
        }),
});