"use client";
import userApi from "@/api/modules/userApi";
import Sidebar from "@/components/Sidebar";
import { selectUser } from "@/hook/user.slice";
import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Setting = () => {
   const user = useSelector(selectUser);
   const [edit, setEdit] = useState(false);
   const [name, setName] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const handleSave = async () => {
      const { res, error } = await userApi.edit({
         id: user._id,
         name: name,
         newPassword: newPassword,
      });
      if (res) {
         toast.success("Changed Name Successfully");
      }
      if (error) toast.error(error.message);
   };
   console.log(name);

   return (
      <div className="w-full flex flex-col gap-5">
         <div className="w-full h-[100px] bg-slate-950 rounded-xl flex gap-5 items-center px-10">
            <div className="w-[250px] text-xl font-bold text-slate-400 ">
               <h1 className="flex justify-center">Display name:</h1>
            </div>
            {edit ? (
               <div className=" w-full flex gap-5 items-center">
                  <div className="w-[50%] text-2xl font-bold text-danger-400 italic ">
                     <Input
                        color="danger"
                        variant="underlined"
                        classNames={{
                           input: ["text-xl"],
                        }}
                        placeholder="Enter your new name"
                        description="6 - 15 words"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={15}
                     />
                  </div>
                  <div className="flex gap-3">
                     <Button
                        color="danger"
                        variant="ghost"
                        radius="full"
                        onClick={() => setEdit(false)}
                        size="sm"
                     >
                        Cancel
                     </Button>
                     <Button
                        color="success"
                        variant="ghost"
                        radius="full"
                        size="sm"
                        onClick={handleSave}
                     >
                        Save
                     </Button>
                  </div>
               </div>
            ) : (
               <div className=" w-full flex gap-5 items-center">
                  <div className="w-[50%] text-2xl font-bold text-danger-400 italic border-b-3 border-danger-400">
                     <h1>{user.displayName}</h1>
                  </div>
                  <div>
                     <Button
                        color="secondary"
                        variant="ghost"
                        radius="full"
                        onClick={() => setEdit(true)}
                        size="sm"
                     >
                        Edit
                     </Button>
                  </div>
               </div>
            )}
         </div>
         <div className="w-full h-[300px] bg-slate-950 rounded-xl px-10 flex flex-col justify-center">
            <div className="w-full flex gap-5  py-3 items-center">
               <div className="w-[50%]">
                  <h1 className="text-lg font-semibold text-slate-400">
                     Old Password:
                  </h1>
               </div>
               <div className="w-full">
                  <Input variant="bordered" color="secondary" radius="full" />
               </div>
            </div>
            <div className="w-full flex gap-5  py-3 items-center">
               <div className="w-[50%]">
                  <h1 className="text-lg font-semibold text-slate-400">
                     New Password:
                  </h1>
               </div>
               <div className="w-full">
                  <Input variant="bordered" color="secondary" radius="full" />
               </div>
            </div>
            <div className="w-full flex gap-5  py-3 items-center">
               <div className="w-[50%]">
                  <h1 className="text-lg font-semibold text-slate-400">
                     Confirm New Password:
                  </h1>
               </div>
               <div className="w-full">
                  <Input variant="bordered" color="secondary" radius="full" />
               </div>
            </div>
            <div className="w-full flex gap-5  py-3 items-center justify-center">
               <Button variant="ghost" radius="full" color="success">
                  Save
               </Button>
            </div>
         </div>
      </div>
   );
};

export default Setting;
