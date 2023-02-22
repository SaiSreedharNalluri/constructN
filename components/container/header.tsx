import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCog,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { getCookie, removeCookies } from "cookies-next";
import DesignRealitySwitch from "./designRealitySwitch";

interface IProps {
  // showDesignRealitySwitch?:boolean;
  // isDesignView?:boolean;
  breadCrumb?: string;
}
const Header: React.FC<IProps> = ({ breadCrumb }) => {
  // if (showDesignRealitySwitch===undefined)
  // {
  //   showDesignRealitySwitch=false
  // }
  // if (isDesignView===undefined)
  // {
  //   showDesignRealitySwitch=false
  // }
  const router = useRouter();
  const headerRef: any = React.useRef();
  let [name, setName] = useState<string>("");
  const [breadCrumbString, setBreadCrumbString] = useState(breadCrumb || "");
  useEffect(() => {
    const userObj: any = getCookie("user");
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?.fullName) {
      setName(user.fullName);
    }
  }, [router.query.projectId]);

  useEffect(() => {
    if (breadCrumb !== undefined) setBreadCrumbString(breadCrumb);
    else setBreadCrumbString("");
  }, [breadCrumb]);

  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const closePopup = (e: any) => {
      //console.log(headerRef.current.contains(e.target));
      if (!headerRef.current.contains(e.target)) {
        setLoading(false);
      }
    };
    document.addEventListener("click", closePopup);
    return () => {
      document.removeEventListener("click", closePopup);
    };
  }, []);
  const userLogOut = () => {
    removeCookies("user");
    router.push("/login");
  };
  const goToProjectsList = () => {
    router.push("/projects");
  };
  //   const toggleDesignType = ()=>{
  //  isDesignView=!isDesignView;
  //  console.log(isDesignView);
  //   }
  return (
    <React.Fragment>
      <div ref={headerRef}>
        <header className="border-b border-solid border-gray-400">
          <div className="flex justify-between">
            <div className="ml-2 mt-2 mb-2 ">
              <img
                onClick={goToProjectsList}
                className=" cursor-pointer h-6"
                src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fs3.amazonaws.com%2Fappforest_uf%2Ff1628494605280x954459828257958600%2FArtboard%25201%2520copy%25202%25404x.png?w=512&h=115&auto=compress&fit=crop&dpr=1.25"
                alt=""
              ></img>
            </div>
            <div className="flex-auto text-sm p-2">{breadCrumbString}</div>

            <div className="flex ">
              {/* <div className={`mt-2 mr-2 mb-2 ${showDesignRealitySwitch?'visible':'hidden'}`}>
              <DesignRealitySwitch toggleDesignType={toggleDesignType} designState={isDesignView?true:false}></DesignRealitySwitch>
            </div> */}
              <div className="mt-2 mr-2 mb-2 w-6 h-6">
                <FontAwesomeIcon icon={faBell} />
              </div>
              <div
                onClick={() => {
                  if (!loading) {
                    setLoading(true);
                  } else {
                    setLoading(false);
                  }
                }}
              >
                <div className="w-6 h-6 mt-2 mr-2 mb-2 rounded-full overflow-hidden border-1 border-gray-900">
                  <Image
                    src="https://images.unsplash.com/photo-1610397095767-84a5b4736cbd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
                    alt=""
                    className={`w-full h-full cursor-pointer object-cover `}
                    title={name}
                    height={1920}
                    width={1080}
                  />
                </div>
              </div>

              {loading && (
                <div className="absolute top-10 right-0 z-50 bg-gray-800 rounded-lg shadow border">
                  <ul className="text-white p-4 ">
                    <li className="font-medium cursor-pointer">
                      <div className="flex items-center justify-center transform transition-colors duration-200">
                        <div className="mr-3">
                          <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                        </div>
                        Account
                      </div>
                    </li>
                    <li className="font-medium cursor-pointer">
                      <div className="flex items-center justify-center transform transition-colors duration-200 ">
                        <div className="mr-3">
                          <FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
                        </div>
                        Settings
                      </div>
                    </li>
                    <hr className="border-gray-700" />
                    <li
                      className="font-medium cursor-pointer"
                      onClick={() => userLogOut()}
                    >
                      <div className="flex items-center justify-center transform transition-colors duration-200 ">
                        <div className="mr-3 ">
                          <FontAwesomeIcon
                            icon={faRightFromBracket}
                          ></FontAwesomeIcon>
                        </div>
                        Logout
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>
    </React.Fragment>
  );
};
export default Header;
