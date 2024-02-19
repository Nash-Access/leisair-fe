import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import axios from "axios";
import { UpdateInfoResponse } from "~/models/appUpdate";

export const appUpdateRouter = createTRPCRouter({
  checkForUpdate: publicProcedure
  .mutation(async () => {
    const response = await axios.post(`${process.env.BACKEND_API_URL ?? "http://localhost:8000"}/check-updates`, {
      current_nextjs_version: process.env.LEISAIR_NEXTJS_VERSION ?? "latest",
    });
    return response.data as UpdateInfoResponse;
  }),
  update: publicProcedure
  .input(z.object({
    services: z.record(z.string()),
  }))
  .mutation(async ({ input }) => {
    return await axios.post(`${process.env.BACKEND_API_URL ?? "http://localhost:8000"}/initiate-update`, {
      services: input?.services || {}, 
    })
  }),
});
