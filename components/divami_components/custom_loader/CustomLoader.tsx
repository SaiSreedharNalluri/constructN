import * as React from "react";
import { styled } from "@mui/material/styles";
import { LoaderContainer, LoaderImage } from "./CustomLoaderStyles";
import closeIcon from "../../../public/divami_icons/ConstructLoader.svg";
import IssuesHighlightedIcon from "../../../public/divami_icons/IssuesHighlightedIcon.svg";
import SpreadLoader from "../../../public/SpreadLoader.json";
import { useLottie } from "lottie-react";

const CustomLoader = () => {
  const animationContainerRef = React.useRef<any>(null);
  const [isLoading,setLoading]=React.useState(true);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: SpreadLoader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { View: lottie } = useLottie(defaultOptions);

  React.useEffect(()=>{
    const timeO = setTimeout(()=>{
      setLoading(false)
    },15000);
  },[]);
  return (
    <>
      {isLoading&&<div>
        <LoaderContainer> {lottie} </LoaderContainer>
      </div>}
    </>
  );
};

export default CustomLoader;
