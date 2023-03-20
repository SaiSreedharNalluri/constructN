import React, { useState } from "react";
import Image from "next/image";
import downArrowIcon from "../../../public/divami_icons/downArrowIcon.svg";
import {
  TypeParentCont,
  TypesTitle,
  TypeArrowIconDiv,
  SelectLayersWrapper,
  DownIcon,
} from "./ToolBarStyles";
import SelectTypesList from "../select-types/SelectTypesList";

// import styles from '../toolbar/toolbar.module.css'

const Typebar = ({
  rightMenuClickHandler,
  myTypesList,
  typeChange,
  selectedValue,
  onListClick,
  openList,
  setOpenList,
}: any) => {
  return (
    <>
      <TypeParentCont onClick={onListClick}>
        <TypesTitle>{selectedValue ? selectedValue : "Select Type"}</TypesTitle>
        <TypeArrowIconDiv>
          {/* <Image src={downArrowIcon} width={12} height={12} alt="Arrow" /> */}
          <DownIcon src={downArrowIcon} alt="Arrow" />
        </TypeArrowIconDiv>
      </TypeParentCont>
      <SelectLayersWrapper typeOfWindow="type">
        <SelectTypesList
          openselectlayer={openList}
          title={"Select Type"}
          onCloseHandler={() => {
            setOpenList(false);
          }}
          optionsList={myTypesList}
          onSelect={typeChange}
        />
      </SelectLayersWrapper>
    </>
  );
};

export default Typebar;