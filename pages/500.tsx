import Image from "next/image";
import { useRouter } from "next/router";
import ErrorNotFound from "../public/divami_icons/ErrorNotFound.svg";
import React, { useEffect, useState } from "react";
import Header from "../components/divami_components/header/Header";
import { getCookie } from "cookies-next";
export default function Custom500() {
    const[isAuth,setIsAuth]=useState(false)
  useEffect(()=>{
    const userObj: any = getCookie('user');
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?.token) {
      setIsAuth(true);
    }
  })
  const router = useRouter();
  return (
    <React.Fragment>
      <div>
        <div>
          {isAuth &&
          <Header hideSidePanel />}  
        </div>
    <div className="flex justify-center items-center calc-h overflow-y-hidden mx-auto">
      <div className="flex flex-col">
      <Image src={ErrorNotFound} alt=""></Image>
      <div className="text-center">
          <h1 className="text-4xl font-sans font-extralight ">500</h1>
          <p className="text-xl  font-sans">Oops, Something Went Wrong</p>
          <p className="font-thin">Try again or Contact our support for help</p>
          <button
            className="my-2 mx-4 py-2 px-[40px] bg-[#f1742e] font-normal text-base leading-4 text-[#ffffff] hover:bg-[#f1742e]  rounded-md" 
            onClick={()=>{
              router.reload()
            }}
          >
            Try Again
          </button>
          <button
            className="my-2 mx-4 py-2 px-[40px] bg-[#f1742e] font-normal text-base leading-4 text-[#ffffff] hover:bg-[#f1742e]  rounded-md" 
            onClick={() => {
              if(isAuth)
              {
                router.push("/projects");
              }
              else{
                router.push("/login");
              }
             
            }}
          >
           {isAuth ? 'Go Home':'SignIn Again'}
          </button>
        </div>
</div>
    </div>
    </div>
    </React.Fragment>
  );
  };