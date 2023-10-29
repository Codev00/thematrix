"use client";
import tmdbConfig from "@/api/config/tmdb.config";
import mediaApi from "@/api/modules/mediaApi";
import { MovieType } from "@/types/media.type";
import { Button, Image, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState, useLayoutEffect, useMemo } from "react";

const ListMovie = () => {
   const [medias, setMedias] = useState<MovieType[]>([]);
   const [page, setPage] = useState(1);
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();
   const rowPerPage = 10;
   useLayoutEffect(() => {
      (async () => {
         const { res, error } = await mediaApi.listMedia();
         if (res) {
            setMedias(res);
         }
         if (error) console.log(error);
      })();
   }, []);

   const items = useMemo(() => {
      const start = 0;
      const add = (page - 1) * rowPerPage;
      const end = add + rowPerPage;
      setIsLoading(false);
      return medias?.slice(start, end);
   }, [page, medias]);
   return (
      <div className="container">
         <div className="mt-20">
            <div className="my-14 flex items-center justify-center">
               <h1 className="text-4xl font-semibold">List Movie</h1>
            </div>
            <div className="flex flex-wrap gap-3 w-full justify-between">
               {items?.map((item: any, index: number) => (
                  <div
                     className="relative h-full w-[45%] md:w-[19%] border-[1px] border-slate-700 group cursor-pointer"
                     onClick={() => router.push(`/movie/${item?._id}`)}
                     key={index}
                  >
                     <Image
                        src={tmdbConfig.posterPath(item?.poster_path)}
                        radius="none"
                     />
                     <div className="block h-0 group-hover:h-[30%] absolute bottom-0 left-0 z-10 bg-black/80 w-full  whitespace-nowrap overflow-hidden text-ellipsis group-hover:px-2 group-hover:py-1 text-slate-200 transition-all duration-500 ease-in">
                        <h1 className="block whitespace-nowrap overflow-hidden text-ellipsis text-base font-bold ">
                           {item?.name}
                        </h1>
                        <div className="flex justify-between">
                           <div className="flex items-center gap-1 text-sm">
                              <i className="fi fi-rr-clock-five flex items-center text-danger-500"></i>
                              <span>{item?.runtime} min</span>
                           </div>
                           <span>{item?.vote_point / item?.vote_count}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
            <div className="flex w-full justify-center mt-14">
               <Button
                  isDisabled={isLoading}
                  variant="bordered"
                  color="danger"
                  onPress={() => {
                     setPage(page + 1);
                     setIsLoading(true);
                  }}
               >
                  {isLoading && <Spinner color="danger" size="sm" />}
                  Load More
               </Button>
            </div>
         </div>
      </div>
   );
};

export default ListMovie;
