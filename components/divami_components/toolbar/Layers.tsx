import { useEffect, useState } from "react";

import cameraIcon from "../../../public/divami_icons/cameraIcon.svg";
import hexagonIcon from "../../../public/divami_icons/hexagonIcon.svg";
import videoRecorderIcon from "../../../public/divami_icons/videoRecorderIcon.svg";

import downArrowIcon from "../../../public/divami_icons/downArrowIcon.svg";
import ClickAwayListener from "@mui/base/ClickAwayListener";
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

export interface ShowImageDisplay {
  item1: boolean;
  item2: boolean;
  item3: boolean;
}

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
    //for loop
    //if is selected
    //arr.push
    //end of

    // setLayersLabels(Object.keys(myLayersList));
    setLayersLabels(arr);
  }, [layersUpdated, selectedArr.length]);
  useEffect(() => {}, [layersLabels]);

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
                <CameraIcon src={cameraIcon} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          }
        })}
      </>
    );
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpenList(false);
      }}
    >
      <ContainerDiv>
        <LayersWrapper onClick={onListClick}>
          <IconsContainer>
            {layersLabels.length > 0 ? (
              <>Layer: {getLayersIcons(layersLabels)}</>
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
