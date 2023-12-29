import * as React from "react";
import GradientLoader from "../../../public/GradientLoader.json";
import { MiniLoaderContainer } from "./CustomLoaderStyles";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
})

const CustomMiniLoader = () => {
  const animationContainerRef = React.useRef<any>(null);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: GradientLoader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  // const { View: lottie } = useLottie(defaultOptions);
  return (
    <MiniLoaderContainer> 
    <div style={{width:"100px", height:"100px", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <Lottie animationData={GradientLoader} loop={true} autoPlay={true} rendererSettings={{preserveAspectRatio: "xMidYMid slice"}} />  
    </div>
</MiniLoaderContainer>

  );
};

export default CustomMiniLoader;
