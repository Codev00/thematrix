"use client";
import tmdbConfig from "@/api/config/tmdb.config";
import mediaApi from "@/api/modules/mediaApi";
import { AddNoteIcon } from "@/assets/icon/NoteIcon";
import StarIcon from "@/assets/icon/StarIcon";
import Title from "@/components/Title";
import { MovieType, RateType } from "@/types/media.type";
import { Button, Image, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState, useLayoutEffect, useMemo } from "react";

const PremiumListMovie = () => {
   const [medias, setMedias] = useState<MovieType[]>([]);
   const [page, setPage] = useState(1);
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();
   const rowPerPage = 10;
   useLayoutEffect(() => {
      (async () => {
         const { res, error } = await mediaApi.listMedia();
         if (res) {
            setMedias(() => res.filter((item) => item.premium === true));
         }
         if (error) console.log(error);
      })();
   }, []);
   const handleVote = (rating: RateType[]) => {
      const total: number = rating.reduce((sum: any, rate: any) => {
         return sum + rate?.rating;
      }, 0);
      if (rating.length !== 0) {
         if (total === 0) {
            return 0;
         }
         const average = total / rating.length;
         return Number(average.toFixed(1));
      }
      return 0;
   };
   const items = useMemo(() => {
      const start = 0;
      const add = (page - 1) * rowPerPage;
      const end = add + rowPerPage;
      setIsLoading(false);
      return medias?.slice(start, end);
   }, [page, medias]);
   return (
      <div className="container min-h-screen">
         <div className="mt-20">
            <div className="my-14 flex items-center justify-center">
               <Title className="text-5xl">Premium Movie</Title>
            </div>
            <div className="flex flex-wrap gap-3 w-full justify-evenly md:justify-start">
               {items?.map((item, index: number) => (
                  <div
                     className="relative h-full w-[45%] md:w-[19%] border-[1px] border-slate-900 group cursor-pointer"
                     onClick={() => router.push(`/movie/${item?._id}`)}
                     key={index}
                  >
                     <Image
                        src={tmdbConfig.posterPath(item?.poster_path)}
                        radius="none"
                     />
                     <div className="h-[40%] md:h-0 group-hover:h-[40%] xl:group-hover:h-[30%] absolute bottom-0 left-0 z-10 bg-transparent group-hover:bg-black/70 w-full  whitespace-nowrap overflow-hidden text-ellipsis px-2 py-1 text-slate-200 transition-height duration-500 ease-in-out flex flex-col justify-between">
                        <div>
                           <h1 className="block whitespace-nowrap overflow-hidden text-ellipsis text-base font-medium ">
                              {item?.name}
                           </h1>
                        </div>
                        <div className="flex justify-between">
                           <div className="flex items-center gap-1 text-sm">
                              <i className="fi fi-rr-clock-five flex items-center text-danger-500"></i>
                              <span>{item?.runtime} min</span>
                           </div>
                           <span className="flex justify-center items-center gap-1">
                              <StarIcon className="text-danger-500" />
                              {handleVote(item.rating)}
                              /10
                           </span>
                        </div>
                        <div className="flex justify-between ">
                           <div>
                              <span className="px-1 text-sm text-danger-300 font-medium border-[1px] border-danger-300">
                                 {item?.quality}
                              </span>
                           </div>
                           <span className="text-danger-500 flex justify-center items-center gap-1 font-bold">
                              <AddNoteIcon />
                              {item?.year}
                           </span>
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

export default PremiumListMovie;
