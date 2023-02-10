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
}: any) => {
  return (
    <>
      <LayersWrapper onClick={onListClick}>
        <LayerSecondSectionHexImg>
          <Image src={hexagonIcon} width={12} height={12} alt="Arrow" />{" "}
        </LayerSecondSectionHexImg>
        <LayerSecondSectionCamImg>
          <Image src={cameraIcon} width={12} height={12} alt="Arrow" />{" "}
        </LayerSecondSectionCamImg>
        <LayerSecondSectionCamImg>
          <Image src={videoRecorderIcon} width={12} height={12} alt="Arrow" />{" "}
        </LayerSecondSectionCamImg>
        <LayerSecondSectionArrImg>
          <Image src={downArrowIcon} width={12} height={12} alt="Arrow" />{" "}
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
        />
      </SelectLayersWrapper>
    </>
  );
};

export default Layers;
