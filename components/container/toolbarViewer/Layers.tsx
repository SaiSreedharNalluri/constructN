import { useEffect, useState } from "react";

import cameraIcon from "../../../public/divami_icons/cameraIcon.svg";
import hexagonIcon from "../../../public/divami_icons/hexagonIcon.svg";
import videoRecorderIcon from "../../../public/divami_icons/videoRecorderIcon.svg";
import DroneImage from "../../../public/divami_icons/DroneImage.svg";
import LaserIcon from "../../../public/icons/LaserIcon.svg";

import downArrowIcon from "../../../public/divami_icons/downArrowIcon.svg";
import { ClickAwayListener } from "@mui/material";
import SelectLayer from "../../container/selectLayer/SelectLayer";
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
import { ILayer } from "../../../models/IReality";
export interface ShowImageDisplay {
  item1: boolean;
  item2: boolean;
  item3: boolean;
}
const LayerIcons = ({iconsList}:any)=>{
  const [myIconsList,setIconsList]= useState<ILayer[]>(iconsList);
  useEffect(()=>{setIconsList(iconsList)},[iconsList])
  return(<>
{myIconsList?.map((label: ILayer, index: number) => {
          if (label.name === "Phone Image" && label.isSelected) {
            return (
              <LayerSecondSectionCamImg key={label.name + index}>
                <CameraIcon src={hexagonIcon} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          } else if (label.name === "360 Image" && label.isSelected) {
            return (
              <LayerSecondSectionCamImg key={label.name + index}>
                <CameraIcon src={cameraIcon} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          } else if (label.name === "360 Video" && label.isSelected) {
            return (
              <LayerSecondSectionCamImg key={label.name + index}>
                <CameraIcon src={videoRecorderIcon} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          } else if (label.name === "Drone Image" && label.isSelected) {
            return (
              <LayerSecondSectionCamImg key={label.name + index}>
                <CameraIcon src={DroneImage} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          } else if (label.name === "Laser") {
            return (
              <LayerSecondSectionCamImg key={label.name + index}>
                <CameraIcon src={LaserIcon} alt="Laser" />
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
  initData
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
    // let newLayersArr = [];
    // if (myLayersList != undefined) {
    //   for (const key in myLayersList) {
    //     newLayersArr.push(myLayersList[key].name);
    //   }
    // }
    // setSelectedArr(newLayersArr);
  }, [myLayersList]);

//   useEffect(() => {
//     let arr: any = [];
//     let obj: any = { ...myLayersList };

//     for (const key in obj) {
//       if (obj[key]?.isSelected) {
//         // console.log("objkeey", obj[key]);
//         arr.push(obj[key].name);
//       }
//     }
//     setLayersLabels(arr);
//   }, [layersUpdated,selectedArr]);
//  useEffect(() => {}, [layersLabels]);

  const getLayersIcons = (layersLabels: any) => {
    return (
      <>
        {layersLabels.map((label: any, index: number) => {
          if (label === "Phone Image") {
            return (
              <LayerSecondSectionCamImg key={label + index}>
                <CameraIcon src={hexagonIcon} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          } else if (label === "360 Image") {
            return (
              <LayerSecondSectionCamImg key={label + index}>
                <CameraIcon src={cameraIcon} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          } else if (label === "360 Video") {
            return (
              <LayerSecondSectionCamImg key={label + index}>
                <CameraIcon src={videoRecorderIcon} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          } else if (label === "Drone Image") {
            return (
              <LayerSecondSectionCamImg key={label + index}>
                <CameraIcon src={DroneImage} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          }
        })}
      </>
    );
  };

  return (
    <div>
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
            {(initData&&(initData.currentLayersList.length > 0 ))? (
              <>Layer:  <LayerIcons iconsList={myLayersList}></LayerIcons>
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
            // selectedLayersList={selectedLayersList}
            // setActiveRealityMap={setActiveRealityMap}
            // layersUpdated={layersUpdated}
            initData={initData}
          />
        </SelectLayersWrapper>
      </ContainerDiv>
    </ClickAwayListener>
    </div>
  );
};

export default Layers;
