"use client";
import userApi from "@/api/modules/userApi";
import { resultType } from "@/types/media.type";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPremium } from "@/hook/global.slice";
import { setUser } from "@/hook/user.slice";
import { toast } from "react-toastify";
import Title from "@/components/Title";

const Payment = () => {
   const searchParams = useSearchParams();
   const dispatch = useDispatch();
   const vnp_Amount = searchParams.get("vnp_Amount");
   const vnp_BankCode = searchParams.get("vnp_BankCode");
   const vnp_BankTranNo = searchParams.get("vnp_BankTranNo");
   const vnp_CardType = searchParams.get("vnp_CardType");
   const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
   const vnp_PayDate = searchParams.get("vnp_PayDate");
   const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
   const vnp_TmnCode = searchParams.get("vnp_TmnCode");
   const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");
   const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
   const vnp_TxnRef = searchParams.get("vnp_TxnRef");
   const vnp_SecureHash = searchParams.get("vnp_SecureHash");
   const [result, setResult] = React.useState<resultType>({
      vnp_TmnCode: "",
      vnp_Amount: 0,
      vnp_BankCode: "",
      vnp_BankTranNo: "",
      vnp_CardType: "",
      vnp_PayDate: "",
      vnp_OrderInfo: "",
      vnp_TransactionNo: 0,
      vnp_ResponseCode: "",
      vnp_TransactionStatus: "",
      vnp_TxnRef: "",
      vnp_SecureHashType: "",
      vnp_SecureHash: "",
      isSuccess: false,
      message: "",
   });
   useEffect(() => {
      (async () => {
         const { res, error } = await userApi.checkPayment({
            vnp_Amount,
            vnp_BankCode,
            vnp_BankTranNo,
            vnp_CardType,
            vnp_PayDate,
            vnp_OrderInfo,
            vnp_ResponseCode,
            vnp_TmnCode,
            vnp_TransactionNo,
            vnp_TransactionStatus,
            vnp_TxnRef,
            vnp_SecureHash,
         });
         if (res) {
            setResult(res);
            if (res.isSuccess) {
               (async () => {
                  const { res, error } = await userApi.getInfo();
                  if (res) {
                     dispatch(setUser(res));
                     dispatch(setPremium(res.premium));
                     await userApi.createBill({
                        amount: vnp_Amount,
                        userId: res._id,
                     });
                  }
                  if (error) toast.error(error?.message);
               })();
               dispatch(setPremium(res.isSuccess));
            }
         }
         if (error) {
            console.log(error);
         }
      })();
   }, []);
   return (
      <div
         className={` container w-full h-screen  flex flex-col justify-start items-center pt-20`}
      >
         {result.isSuccess && (
            <div
               className={` text-4xl md:text-7xl font-normal flex flex-col items-center  gap-10`}
            >
               <Title
                  className={` text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-violet-500 to-pink-600`}
               >
                  Successful Transaction
               </Title>
               <div className="w-full flex flex-col gap-5 items-center">
                  <h1 className="text-2xl font-bold text-purple-700 uppercase italic">
                     Enjoy premium perks {"==>"}
                  </h1>
                  <div className="w-[50%] text-xl flex flex-col gap-5 ml-5 italic">
                     <h1>
                        <span className="text-purple-700">{"==>"}</span> High
                        video quality: Ability to select high definition
                        resolutions like FHD or 4K.
                     </h1>
                     <h1>
                        <span className="text-purple-700">{"==>"}</span> List
                        favorites
                     </h1>
                     <h1>
                        <span className="text-purple-700">{"==>"}</span>{" "}
                        Priority support: Faster response times if technical
                        issues arise.
                     </h1>
                     <h1>
                        <span className="text-purple-700">{"==>"}</span> Watch
                        movies exclusively for premium members
                     </h1>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default Payment;
