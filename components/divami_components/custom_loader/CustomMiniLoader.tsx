import { useLottie } from "lottie-react";
import * as React from "react";
import GradientLoader from "../../../public/GradientLoader.json";
import { MiniLoaderContainer } from "./CustomLoaderStyles";

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
    {}
    </div>
</MiniLoaderContainer>

  );
};

export default CustomMiniLoader;
