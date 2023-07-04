import { NextPage, NextPageContext } from "next";
import NextImage from "../components/core/Image";
import { useRouter } from "next/router";
import ErrorNotFound from "../public/divami_icons/ErrorNotFound.svg";
import React, { useEffect, useState } from "react";
import Header from "../components/divami_components/header/Header";
import { getCookie } from "cookies-next";
type ErrorPageProps = {
  statusCode?: number;
  message?: string;
};

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode, message }) => {
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
     
    <div className="m-auto">
      <div className="flex justify-center mt-2">
      <NextImage
        src={ErrorNotFound}
        className="h-3/4 w-3/4"
      />
      </div>
     <div className="absolute w-1/4 h-1/4 top-3/4 left-1/3 rounded p-2 text-center">
        <div className="mt-10 ml-20">
          <h1 className="text-base">{statusCode}</h1>
          <p className="text-sm">{message}</p>
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
    </div>
    </React.Fragment>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  let message = err ? err.message : "An error occurred";
  if(statusCode=== 404)
  {
    message ='Page Not Found'
  }
  return { statusCode, message };
};

export default ErrorPage;