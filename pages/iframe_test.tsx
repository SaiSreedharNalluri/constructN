import React, { useEffect, useRef, useState } from "react";
import {LeftOverLay,OpenMenuButton,CloseMenuButton} from "../components/container/mqttViewerTool";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useRouter } from "next/router";

const Login = () => {
  let [isDevMode, setDevMode] = useState(false);
const [isToolsOpen,setToolsOpen] = useState(false);
const leftRefContainer: any = useRef();
const router = useRouter();
useEffect(() => {
  if (router.isReady) {
    
    if(router.query.devMode==="true"){
      setDevMode(true);
    }
    else{
      setDevMode(false);
    }
    }
    },[router.isReady,router.query.projectId]);
  return (
    <div className="fixed  h-full w-full flex flex-col" >
      {isDevMode&&isToolsOpen ? (
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #BDBDBD",
                boxShadow: "5px 4px 8px rgb(200 200 200 / 10%)",
                // transform: "matrix(-1, 0, 0, 1, 0, 0)",
              }}
            >
              <CloseMenuButton>
                <div
                 
                  
                  onClick={() => {
                    setToolsOpen(false);
                  }}
                >
                  <KeyboardDoubleArrowRightIcon></KeyboardDoubleArrowRightIcon>
                </div>
                
              </CloseMenuButton>
              <div>
                {
                  <div
                    style={{
                      overflow: "hidden",
                      marginLeft:"1px" ,
                      zIndex: "99",
                      width:"30%"
                    }}
                    ref={leftRefContainer}
                    className={`${
                      isToolsOpen ? "visible" : "hidden"
                    }  absolute z-10 border  white-bg projHier `}
                  >
                    <div >
                      <LeftOverLay
                        
                      ></LeftOverLay>
                    </div>
                  </div>
                }
              </div>
            </div>
          ) : isDevMode&&(
            <div >
              <OpenMenuButton
                onClick={() => {
                  setToolsOpen(!isToolsOpen);
                  
                }}
                
              >
                <div
                  style={{marginLeft:"0px" }}
                ><KeyboardDoubleArrowRightIcon></KeyboardDoubleArrowRightIcon></div>
                <div>Tools</div>
              </OpenMenuButton>
  
            </div>
          )}
      <iframe src="http://localhost:3000/projects/PRJ201897/structure/STR013274" height="100%" width="100%"></iframe>
    </div>
  );
};

export default Login;
