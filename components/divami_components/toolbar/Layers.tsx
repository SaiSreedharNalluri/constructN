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

const Layers = ({
  rightMenuClickHandler,
  myLayersList,
  LayerChange,
  selectedValue,
  onListClick,
  openList,
  setOpenList,
  selectedLayersList,
}: any) => {
  const [layersLabels, setLayersLabels] = useState<any>([]);

  useEffect(() => {
    if (myLayersList) {
      setLayersLabels(Object.keys(myLayersList));
    }
  }, [myLayersList]);

  useEffect(() => {
    console.log(layersLabels, "siva");
  }, [layersLabels]);

  const getLayersIcons = (layersLabels: any) => {
    console.log(layersLabels, "layersLabels");
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
           } else if (label === "Drone Image") {
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
            {selectedLayersList.length > 0
              ? getLayersIcons(selectedLayersList)
              : "Select Layer"}
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
          />
        </SelectLayersWrapper>
      </ContainerDiv>
    </ClickAwayListener>
  );
};

export default Layers;
