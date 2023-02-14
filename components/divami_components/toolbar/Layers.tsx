import React, { useState } from "react";
import Image from "next/image";

import layersCubeIcon from "../../../public/divami_icons/layersCubeIcon.svg";
import mapCubeIcon from "../../../public/divami_icons/mapCubeIcon.svg";

import videoCubeIcon from "../../../public/divami_icons/videoCubeIcon.svg";
import hexagonIcon from "../../../public/divami_icons/hexagonIcon.svg";
import cameraIcon from "../../../public/divami_icons/cameraIcon.svg";
import videoRecorderIcon from "../../../public/divami_icons/videoRecorderIcon.svg";

import downArrowIcon from "../../../public/divami_icons/downArrowIcon.svg";
import {
  LayersWrapper,
  LayerSecondSectionHexImg,
  LayerSecondSectionCamImg,
  LayerSecondSectionArrImg,
  SelectLayersWrapper,
} from "./ToolBarStyles";
import SelectLayer from "../select-layers/SelectLayer";

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
  return (
    <>
      <LayersWrapper onClick={onListClick}>
        <LayerSecondSectionHexImg>
          <Image src={hexagonIcon} alt="Arrow" />{" "}
        </LayerSecondSectionHexImg>
        <LayerSecondSectionCamImg>
          <Image src={cameraIcon} alt="Arrow" />{" "}
          {/* <Image src={cameraIcon} width={18} height={18} alt="Arrow" />{" "} */}
        </LayerSecondSectionCamImg>
        <LayerSecondSectionCamImg>
          <Image src={videoRecorderIcon} alt="Arrow" />{" "}
        </LayerSecondSectionCamImg>
        <LayerSecondSectionArrImg>
          <Image src={downArrowIcon} alt="Arrow" />{" "}
        </LayerSecondSectionArrImg>
      </LayersWrapper>
      <SelectLayersWrapper>
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
    </>
  );
};

export default Layers;
