import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import layersCubeIcon from '../../../public/divami_icons/layersCubeIcon.svg';
import mapCubeIcon from '../../../public/divami_icons/mapCubeIcon.svg';

import videoCubeIcon from '../../../public/divami_icons/videoCubeIcon.svg';
import hexagonIcon from '../../../public/divami_icons/hexagonIcon.svg';
import cameraIcon from '../../../public/divami_icons/cameraIcon.svg';
import videoRecorderIcon from '../../../public/divami_icons/videoRecorderIcon.svg';

import downArrowIcon from '../../../public/divami_icons/downArrowIcon.svg';
import {
  LayersWrapper,
  LayerSecondSectionHexImg,
  LayerSecondSectionCamImg,
  LayerSecondSectionArrImg,
  SelectLayersWrapper,
  CameraIcon,
  DownIcon,
  IconsContainer,
} from './ToolBarStyles';
import SelectLayer from '../select-layers/SelectLayer';

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
    console.log(layersLabels, 'siva');
  }, [layersLabels]);

  const getLayersIcons = (layersLabels: any) => {
    console.log(layersLabels, 'layersLabels');
    return (
      <>
        {layersLabels.map((label: any, index: number) => {
          if (label === 'Phone Image') {
            return (
              <LayerSecondSectionCamImg key={label + index}>
                <CameraIcon src={hexagonIcon} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          } else if (label === '360 Image') {
            return (
              <LayerSecondSectionCamImg key={label + index}>
                <CameraIcon src={cameraIcon} alt="Arrow" />
              </LayerSecondSectionCamImg>
            );
          } else if (label === '360 Video') {
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
    <>
      <LayersWrapper onClick={onListClick}>
        <IconsContainer>
          {selectedLayersList.length > 0
            ? getLayersIcons(selectedLayersList)
            : 'Select Layer'}
        </IconsContainer>
        <LayerSecondSectionCamImg>
          <DownIcon src={downArrowIcon} alt="Arrow" />
        </LayerSecondSectionCamImg>
      </LayersWrapper>
      <SelectLayersWrapper>
        <SelectLayer
          openselectlayer={openList}
          title={'Select Layer'}
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
