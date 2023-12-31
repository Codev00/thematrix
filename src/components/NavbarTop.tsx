"use client";
import { RootState } from "@/hook/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
   Navbar,
   NavbarBrand,
   NavbarContent,
   NavbarItem,
   Link,
   NavbarMenu,
   NavbarMenuItem,
   NavbarMenuToggle,
   Dropdown,
   DropdownTrigger,
   Avatar,
   DropdownMenu,
   DropdownItem,
   Image,
   Tooltip,
   Input,
   Accordion,
   AccordionItem,
} from "@nextui-org/react";
import {
   Movie,
   listGenres,
   setActive,
   setGenres,
   setListMovie,
   setPremium,
} from "@/hook/global.slice";
import { logout, selectUser, setUser } from "@/hook/user.slice";
import { toast } from "react-toastify";
import ListGenre from "./ListGenre";
import { SearchIcon } from "@/assets/icon/SearchIcon";
import tmdbConfig from "@/api/config/tmdb.config";
import userApi from "@/api/modules/userApi";
import mediaApi from "@/api/modules/mediaApi";
import genreApi from "@/api/modules/genreApi";

const NavbarTop = () => {
   const user = useSelector(selectUser);
   const [scroll, setScroll] = useState(0);
   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
   const router = useRouter();
   const [search, setSearch] = useState("");
   const movies = useSelector(Movie);
   const Genres = useSelector(listGenres);
   const p = usePathname().split("/")[1];
   const menuItems = [
      { name: "Home", link: "/" },
      { name: "Movie", link: "/movie/list" },
      { name: "Premium", link: "/premium" },
      { name: "Genres", link: "/genres" },
      { name: "About", link: "/about" },
   ];
   const isActive = useSelector((state: RootState) => state.global.isActive);
   const dispatch = useDispatch();
   useEffect(() => {
      window.addEventListener("scroll", () => {
         setScroll(window.scrollY);
      });

      return () => {
         window.removeEventListener("scroll", () => {
            setScroll(window.scrollY);
         });
      };
   }, [scroll]);
   useLayoutEffect(() => {
      if (p === "") dispatch(setActive("Home"));
      if (p === "movie") dispatch(setActive("Movie"));
      if (p === "premium") dispatch(setActive("Premium"));
      if (p === "about") dispatch(setActive("About"));
   }, [p]);
   const handleLogout = () => {
      dispatch(logout());
      toast.warning("You are signed out !!!");
      router.push("sign-in");
   };
   const searchList = useMemo(() => {
      if (search) {
         return movies
            .filter((movie) => {
               return movie.name.toLowerCase().includes(search.toLowerCase());
            })
            .slice(0, 7);
      }
   }, [search]);
   useEffect(() => {
      (async () => {
         const { res, error } = await mediaApi.listMedia();
         if (res) dispatch(setListMovie(res));
         if (error) toast.error(error?.message);
      })();
      (async () => {
         const { res, error } = await genreApi.list();
         if (res) dispatch(setGenres(res));
         if (error) toast.error(error?.message);
      })();
   }, [dispatch]);
   useEffect(() => {
      (async () => {
         const { res, error } = await userApi.getInfo();
         if (res) {
            dispatch(setUser(res));
            dispatch(setPremium(res.premium));
         }
         if (error) toast.error(error?.message);
      })();
   }, [dispatch]);
   const handleSearch = () => {
      router.push(`/movie/search?title=${search}`);
      setSearch("");
   };
   return (
      <Navbar
         shouldHideOnScroll
         onMenuOpenChange={setIsMenuOpen}
         isBlurred={false}
         className={`${
            scroll === 0 ? "md:bg-transparent" : "bg-black/60"
         } bg-black/90 fixed `}
         classNames={{
            menuItem: ["hover:color-danger"],
            item: [
               "flex",
               "relative",
               "items-center",
               "text-3xl",
               "data-[active=true]:font-bold",
               "data-[active=true]:after:content-['']",
               "data-[active=true]:after:absolute",
               "data-[active=true]:after:bottom-0",
               "data-[active=true]:after:left-0",
               "data-[active=true]:after:right-0",
               "data-[active=true]:after:-bottom-1",
               "data-[active=true]:after:h-[2px]",
               "data-[active=true]:after:rounded-[3px]",
               "data-[active=true]:after:bg-danger",
               "transition-all",
               "duration-500",
               "ease-linear",
               "hover:color-danger",
            ],
         }}
      >
         <NavbarContent>
            <NavbarMenuToggle
               aria-label={isMenuOpen ? "Close menu" : "Open menu"}
               className="sm:hidden"
            />
            <NavbarBrand
               className="text-white text-2xl font flex gap-2 cursor-pointer"
               onClick={() => router.push("/")}
            >
               <Image
                  src="/images/wolf.png"
                  width={50}
                  height={50}
                  radius="none"
               />
               <p className="font-bold text-inherit peer cursor-pointer">
                  MA{" "}
                  <span className="bg-danger px-2 rounded-md peer-hover:line-through">
                     TRIX
                  </span>
               </p>
            </NavbarBrand>
         </NavbarContent>

         <NavbarContent className="hidden sm:flex gap-4" justify="center">
            {menuItems.map((item, index) => (
               <NavbarItem
                  key={index}
                  isActive={isActive === item.name}
                  className="cursor-pointer"
               >
                  {item.name === "Genres" ? (
                     <Tooltip
                        radius="lg"
                        showArrow
                        shadow="lg"
                        content={<ListGenre />}
                        classNames={{
                           base: ["bg-slate-950"],
                           arrow: [" bg-slate-950"],
                        }}
                     >
                        <Link aria-current="page" color="foreground" size="lg">
                           {item.name}
                        </Link>
                     </Tooltip>
                  ) : (
                     <Link
                        color={isActive === item.name ? "danger" : "foreground"}
                        aria-current="page"
                        onClick={() => {
                           if (item.name !== "Genres") {
                              dispatch(setActive(item.name));
                              router.push(item.link);
                           }
                        }}
                        size="lg"
                     >
                        {item.name}
                     </Link>
                  )}
               </NavbarItem>
            ))}
         </NavbarContent>
         <NavbarMenu>
            {menuItems.map((item, index) => (
               <NavbarMenuItem key={`${item}-${index}`} className="text-xl">
                  {item.name === "Genres" ? (
                     <Accordion
                        itemClasses={{ base: ["px-0"] }}
                        className="px-0"
                     >
                        <AccordionItem
                           key="1"
                           aria-label="Genres"
                           title="Genres"
                           className="py-0"
                           classNames={{
                              trigger: "py-0",
                           }}
                        >
                           <div className="flex w-full flex-wrap  ">
                              {Genres?.map((item, index) => (
                                 <div
                                    key={index}
                                    className="flex items-start text-slate-400 justify-center px-3  py-2 w-[50%] cursor-pointer box-border  hover:text-danger font-normal transition-all duration-300 ease-linear"
                                    onClick={() =>
                                       router.push(
                                          `/movie/search/genre?search=${item._id}&title=${item.title}`
                                       )
                                    }
                                 >
                                    <span>{item.title}</span>
                                 </div>
                              ))}
                           </div>
                        </AccordionItem>
                     </Accordion>
                  ) : (
                     <Link
                        color={isActive === item.name ? "danger" : "foreground"}
                        className="w-full"
                        size="lg"
                        href={
                           item.name === "Home"
                              ? "/"
                              : item.name === "Movie"
                              ? "/movie/list"
                              : item.name === "Premium"
                              ? "/premium"
                              : "/about"
                        }
                     >
                        {item.name}
                     </Link>
                  )}
               </NavbarMenuItem>
            ))}
         </NavbarMenu>
         {user.username && (
            <NavbarContent as="div" justify="end">
               <div className="hidden md:block relative">
                  <Input
                     classNames={{
                        base: "max-w-[8rem] sm:max-w-[10rem] h-10",
                        mainWrapper: "h-full",
                        input: "text-small",
                        inputWrapper:
                           "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                     }}
                     placeholder="Search movie..."
                     size="sm"
                     variant="flat"
                     color="secondary"
                     startContent={<SearchIcon size={18} />}
                     type="search"
                     onChange={(e) => setSearch(e.target.value)}
                     value={search}
                     autoComplete="off"
                     onKeyUp={(e) => {
                        if (e.key === "Enter") {
                           handleSearch();
                        }
                     }}
                  />
                  {searchList && (
                     <div className="absolute bg-slate-950 w-[250px] right-0 max-h-[500px] mt-2 overflow-y-scroll scrollbar-hide px-1 py-2 rounded-md">
                        <div className="flex flex-col gap-2  ">
                           {searchList.length === 0 && (
                              <div className="h-10 flex items-center justify-center">
                                 <span className="text-slate-100">
                                    No search Item
                                 </span>
                              </div>
                           )}
                           {searchList.map((item, index) => (
                              <div
                                 className="flex gap-2 h-[150px] cursor-pointer"
                                 onClick={() => {
                                    setSearch("");
                                    router.push(`/movie/${item?._id}`);
                                 }}
                                 key={index}
                              >
                                 <Image
                                    src={tmdbConfig.posterPath(
                                       item.poster_path
                                    )}
                                    width={100}
                                    height={150}
                                    radius="md"
                                    className="w-[100px]"
                                 />
                                 <div className="text-sm font-bold w-[140px] text-slate-100 whitespace-wrap overflow-hidden text-ellipsis">
                                    <span className="">{item.name}</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                        {searchList.length > 0 && (
                           <div className="flex w-full h-[50px] bg-red-500 justify-center items-center mt-1">
                              <span className="text-slate-100 ">
                                 Enter to watch more
                              </span>
                           </div>
                        )}
                     </div>
                  )}
               </div>
               <Dropdown
                  placement="bottom-end"
                  showArrow
                  className="border-[1px] border-warning-500 bg-slate-900"
                  classNames={{
                     arrow: "bg-warning-500",
                  }}
               >
                  <DropdownTrigger>
                     <Avatar
                        isBordered
                        showFallback
                        as="button"
                        className="transition-transform object-cover"
                        color="warning"
                        size="sm"
                        // name={user.displayName}
                        src="https://images.unsplash.com/broken"
                        classNames={{
                           base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                           icon: "text-black/80",
                        }}
                     />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                     <DropdownItem
                        key="profile"
                        className="h-14 gap-2"
                        onClick={() =>
                           router.push(`/user/${user.username}/setting`)
                        }
                     >
                        <p className="font-bold">{user.displayName}</p>
                        <p className="font-normal">@{user.username}</p>
                     </DropdownItem>
                     <DropdownItem
                        key="favorite"
                        onClick={() =>
                           router.push(`/user/${user.username}/favorites`)
                        }
                     >
                        Favorites
                     </DropdownItem>
                     <DropdownItem
                        key="premium"
                        onClick={() => router.push(`/user/premium`)}
                     >
                        Premium
                     </DropdownItem>
                     <DropdownItem
                        key="logout"
                        color="danger"
                        onClick={() => handleLogout()}
                     >
                        Log Out
                     </DropdownItem>
                  </DropdownMenu>
               </Dropdown>
            </NavbarContent>
         )}
      </Navbar>
   );
};

export default NavbarTop;
