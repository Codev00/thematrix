import { AxiosResponse } from "axios";
import publicClient from "../config/public.client";
import { MovieType } from "@/types/media.type";

const mediaApi = {
   listMedia: async () => {
      try {
         const res = await publicClient.get<MovieType[], MovieType[]>(
            "/api/v1/movie/list"
         );
         return { res };
      } catch (error: any) {
         return { error };
      }
   },
   getMedia: async (id: any) => {
      try {
         const res = await publicClient.get<MovieType, MovieType>(
            `/api/v1/movie/get/${id}`
         );
         return { res };
      } catch (error: any) {
         return { error };
      }
   },
   searchGenre: async (id: any) => {
      try {
         const res = await publicClient.get<MovieType[], MovieType[]>(
            `/api/v1/movie/search/genre?search=${id}`
         );
         return { res };
      } catch (error: any) {
         return { error };
      }
   },
};

export default mediaApi;
