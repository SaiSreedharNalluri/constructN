import { useEffect, useState } from "react";
import capture360Image from "../../../public/divami_icons/capture360Image.svg";
import PhoneImageNewCapture from "../../../public/divami_icons/PhoneImageNewCapture.svg";
import CaptureVideoWalk from "../../../public/divami_icons/CaptureVideoWalk.svg";
import DroneImageNew from "../../../public/divami_icons/DroneImageNew.svg";

import downArrowIcon from "../../../public/divami_icons/downArrowIcon.svg";
import SelectLayer from "../select-layers/SelectLayer";
import {
  CameraIcon,
  DownIcon,
  IconsContainer,
  LayerSecondSectionCamImg,
  LayersWrapper,
  SelectLayersWrapper,
  ContainerDiv,
} from "./ToolBarStyles";
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
import { ClickAwayListener } from "@mui/material";
export interface ShowImageDisplay {
  item1: boolean;
  item2: boolean;
  item3: boolean;
}
const LayerIcons = ({iconsList}:any)=>{
  const [myIconsList,setIconsList]= useState<any>(iconsList);
  useEffect(()=>{setIconsList(iconsList)},[iconsList])
  return(<>
{myIconsList.map((label: any, index: number) => {
          if (label === "Phone Image") {
            return (
              <LayerSecondSectionCamImg key={label + index}>
                <CameraIcon src={PhoneImageNewCapture} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          } else if (label === "360 Image") {
            return (
              <LayerSecondSectionCamImg key={label + index}>
                <CameraIcon src={capture360Image} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          } else if (label === "360 Video") {
            return (
              <LayerSecondSectionCamImg key={label + index}>
                <CameraIcon src={CaptureVideoWalk} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          } else if (label === "Drone Image") {
            return (
              <LayerSecondSectionCamImg key={label + index}>
                <CameraIcon src={DroneImageNew} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          }
        })}
</>
)};

const Layers = ({
  rightMenuClickHandler,
  myLayersList,
  LayerChange,
  selectedValue,
  onListClick,
  openList,
  setOpenList,
  selectedLayersList,
  setActiveRealityMap,
  layersUpdated,
}: any) => {
  const [selectedArr, setSelectedArr] = useState<any>([]);
  const [layersLabels, setLayersLabels] = useState<any>([]);
  const [showImageIcon, setShowImageIcon] = useState<ShowImageDisplay>({
    item1: true,
    item2: true,
    item3: true,
  });
  const customLogger = new CustomLoggerClass();
  useEffect(() => {
    let newLayersArr = [];
    if (myLayersList != undefined) {
      for (const key in myLayersList) {
        newLayersArr.push(myLayersList[key].name);
      }
    }
    setSelectedArr(newLayersArr);
  }, [myLayersList]);

  useEffect(() => {
    let arr: any = [];
    let obj: any = { ...myLayersList };

    for (const key in obj) {
      if (obj[key]?.isSelected) {
        // console.log("objkeey", obj[key]);
        arr.push(obj[key].name);
      }
    }
    setLayersLabels(arr);
  }, [layersUpdated,selectedArr]);
 // useEffect(() => {}, [layersLabels]);

  // const getLayersIcons = (layersLabels: any) => {
  //   return (
  //     <>
  //       {layersLabels.map((label: any, index: number) => {
  //         if (label === "Phone Image") {
  //           return (
  //             <LayerSecondSectionCamImg key={label + index}>
  //               <CameraIcon src={hexagonIcon} alt="Arrow" />
  //             </LayerSecondSectionCamImg>
  //           );
  //         } else if (label === "360 Image") {
  //           return (
  //             <LayerSecondSectionCamImg key={label + index}>
  //               <CameraIcon src={cameraIcon} alt="Arrow" />
  //             </LayerSecondSectionCamImg>
  //           );
  //         } else if (label === "360 Video") {
  //           return (
  //             <LayerSecondSectionCamImg key={label + index}>
  //               <CameraIcon src={videoRecorderIcon} alt="Arrow" />
  //             </LayerSecondSectionCamImg>
  //           );
  //         } else if (label === "Drone Image") {
  //           return (
  //             <LayerSecondSectionCamImg key={label + index}>
  //               <CameraIcon src={DroneImage} alt="Arrow" />
  //             </LayerSecondSectionCamImg>
  //           );
  //         }
  //       })}
  //     </>
  //   );
  // };

  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpenList(false);
      }}
    >
      <ContainerDiv>
        <LayersWrapper
          onClick={()=>{customLogger.logInfo("ToolBar - Change Layer Filter");onListClick();}}
          // style={{ border: "2px solid blue" }}
        >
          <IconsContainer>
            {(layersLabels&&(layersLabels.length > 0 ))? (
              <>Layer:  <LayerIcons iconsList={layersLabels}></LayerIcons>
              </>
            ) : (
              "Select Layer"
            )}
          </IconsContainer>
          <LayerSecondSectionCamImg>
            <DownIcon src={downArrowIcon} alt="Arrow" />
          </LayerSecondSectionCamImg>
        </LayersWrapper>
        <SelectLayersWrapper typeOfWindow={"layer"} style={{ width: "238px" }}>
          <SelectLayer
            openselectlayer={openList}
            title={"Select Layer"}
            onCloseHandler={() => {
              setOpenList(false);
            }}
            optionsList={myLayersList}
            onSelect={LayerChange}
            selectedLayersList={selectedLayersList}
            setActiveRealityMap={setActiveRealityMap}
            layersUpdated={layersUpdated}
          />
        </SelectLayersWrapper>
      </ContainerDiv>
    </ClickAwayListener>
  );
};

export default Layers;
