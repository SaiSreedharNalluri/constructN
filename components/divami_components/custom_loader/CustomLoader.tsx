import * as React from "react";
import { styled } from "@mui/material/styles";
import { LoaderContainer, LoaderImage } from "./CustomLoaderStyles";
import closeIcon from "../../../public/divami_icons/ConstructLoader.svg";
import IssuesHighlightedIcon from "../../../public/divami_icons/IssuesHighlightedIcon.svg";
import SpreadLoader from "../../../public/SpreadLoader.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
})

const CustomLoader = () => {
  const animationContainerRef = React.useRef<any>(null);
  const [isLoading,setLoading]=React.useState(false);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: SpreadLoader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  // const { View: lottie } = useLottie(defaultOptions);

  React.useEffect(()=>{
    const time1 = setTimeout(()=>{
      setLoading(true)
    },1000);
    const timeO = setTimeout(()=>{
      setLoading(false)
    },15000);
  },[]);
  return (
    <>
      {isLoading&&<div>
        <LoaderContainer> 
          <Lottie animationData={SpreadLoader} loop={true} autoPlay={true} rendererSettings={{preserveAspectRatio: "xMidYMid slice"}} />  
        </LoaderContainer>
      </div>}
    </>
  );
};

export default CustomLoader;
