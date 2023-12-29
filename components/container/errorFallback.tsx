import { FallbackProps } from "react-error-boundary";
import Image from "next/image";
import ErrorNotFound from "../../public/divami_icons/ErrorNotFound.svg";
import Header from "../divami_components/header/Header";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const[isAuth,setIsAuth]=useState(false)
  useEffect(()=>{
    const userObj: any = getCookie('user');
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?.token) {
      setIsAuth(true);
    }
  })
  console.log('application error',error.message)
  return (
    <div>
       <div>
          {isAuth &&
          <Header hideSidePanel />}
        </div>
        <div className="flex justify-center items-center calc-h overflow-y-hidden mx-auto">
<div className="flex flex-col">
<Image src={ErrorNotFound} alt=""></Image>
<div className="text-center">
<h1 className="text-xl  font-thin">Something Went Wrong</h1>
          <button
            className="my-2 mx-4 py-2 px-[40px] bg-[#f1742e] font-normal text-base leading-4 text-[#ffffff] hover:bg-[#f1742e]  rounded-md" 
            onClick={resetErrorBoundary}
          >
            Try Again
          </button>
          <button
            className="my-2 mx-4 py-2 px-[40px] bg-[#f1742e] font-normal text-base leading-4 text-[#ffffff] hover:bg-[#f1742e]  rounded-md" 
                        onClick={() => {
              if(isAuth)
              {
                window.location.href = '/projects'
              }
              else{
                window.location.href = "/login"
              }
            }}
          >
             {isAuth ? 'Go Home':'SignIn Again'}
          </button>
</div>
  </div>
  </div>
    
    </div>
  );
}

export default ErrorFallback;