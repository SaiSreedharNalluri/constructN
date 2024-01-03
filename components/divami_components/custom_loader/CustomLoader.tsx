import * as React from "react";
import { LoaderContainer } from "./CustomLoaderStyles";
import SpreadLoader from "../../../public/SpreadLoader.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
})
interface IProps{
  isLoadingClose?:boolean
}
const CustomLoader:React.FC<IProps> = ({isLoadingClose=false}) => {
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
    if(isLoadingClose === false)
    {
      setTimeout(()=>{
        setLoading(false)
      },15000);
    }
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
