import { FallbackProps } from "react-error-boundary";
import NextImage from "../core/Image";
import { useRouter } from "next/router";
import ErrorNotFound from "../../public/divami_icons/ErrorNotFound.svg";
import Header from "../divami_components/header/Header";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const router = useRouter();
  const[isAuth,setIsAuth]=useState(false)
  useEffect(()=>{
    const userObj: any = getCookie('user');
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?.token) {
      setIsAuth(true);
    }
  })
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
        <div>
          <h1 className="text-sm">Something went wrong</h1>
          <p className="text-sm">{error.message}</p>
          <button
            className="mt-2 p-2 px-2 py-1 ml-1  focus:outline-none bg-orange-400 hover:bg-gray-800 rounded text-white text-sm"
            onClick={resetErrorBoundary}
          >
            Try again
          </button>
          <button
            className="mt-2 p-2 px-2 py-1 ml-1  focus:outline-none bg-orange-400 hover:bg-gray-800 rounded text-white text-sm"
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
             {isAuth ? 'Back To Home':'Back To LogIn'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;