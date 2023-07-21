import { FallbackProps } from "react-error-boundary";
import NextImage from "../core/Image";
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
      <div className="flex justify-center mt-2">
        <NextImage
          src={ErrorNotFound}
          className="h-3/4 w-3/4"
        />
      </div>
      <div className="absolute w-1/4 h-1/4 top-3/4 left-1/3 rounded p-2 text-center text-base">
        <div className="font-sans">
          <h1 className="text-xl  font-thin">Something Went Wrong</h1>
          <button
            className="mt-2 p-2 px-2 py-1 ml-1  focus:outline-none bg-orange-400 hover:bg-gray-800 rounded text-white text-sm"
            onClick={resetErrorBoundary}
          >
            Try Again
          </button>
          <button
            className="mt-2 p-2 px-2 py-1 ml-1  focus:outline-none bg-orange-400 hover:bg-gray-800 rounded text-white text-sm"
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
  );
}

export default ErrorFallback;