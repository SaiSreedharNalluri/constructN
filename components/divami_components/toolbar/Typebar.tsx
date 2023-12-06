import React, { useState } from "react";
import Image from "next/image";
import downArrowIcon from "../../../public/divami_icons/downArrowIcon.svg";
import {
  TypeParentCont,
  TypesTitle,
  TypeArrowIconDiv,
  SelectLayersWrapper,
  DownIcon,
  ContainerDiv,
} from "./ToolBarStyles";
import SelectTypesList from "../select-types/SelectTypesList";

// import styles from '../toolbar/toolbar.module.css'
import CustomLoggerClass from "../../divami_components/custom_logger/CustomLoggerClass";
import { ClickAwayListener } from "@mui/material";

const Typebar = ({
  rightMenuClickHandler,
  myTypesList,
  typeChange,
  selectedValue,
  onListClick,
  openList,
  setOpenList,
}: any) => {
  const customLogger = new CustomLoggerClass();
  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpenList(false);
      }}
    >
      <ContainerDiv>
      <TypeParentCont onClick={()=>{ customLogger.logInfo("ToolBar - Change View Type");onListClick()}}>
          <TypesTitle>
            {selectedValue ? "Type: " + selectedValue : "Select Type"}
          </TypesTitle>
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
      </ContainerDiv>
    </ClickAwayListener>
  );
};

export default Typebar;
