import React, { useEffect, useState } from "react";
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
import SelectTypesList from "../../container/selectType/SelectTypesList"

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
  initData
}: any) => {
  const customLogger = new CustomLoggerClass();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if(anchorEl === null ) {
      setAnchorEl(event.currentTarget);
    }
    else {
      // setAnchorEl(null);
    }
  };

  useEffect(()=>{
    setAnchorEl(null);
  },[initData])
  
  const handleClose = (e:any) => {
    setAnchorEl(null);
  };
  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpenList(false);
      }}
    >
      <ContainerDiv onClick={handleClick}>
        <TypeParentCont onClick={() => { customLogger.logInfo("ToolBar - Change View Type"); onListClick();}}>
          {/* <TypesTitle>
            {selectedValue ? "Type: " + selectedValue : "Select Type"}
          </TypesTitle> */}
          <TypesTitle>
            {selectedValue === "pointCloud" ? "Type: Reality"  : selectedValue === "orthoPhoto" ? "Type: Map" : "Type: " + selectedValue || "Select Type"}
          </TypesTitle>
          <TypeArrowIconDiv>
            {/* <Image src={downArrowIcon} width={12} height={12} alt="Arrow" /> */}
            <DownIcon src={downArrowIcon} alt="Arrow" />
          </TypeArrowIconDiv>
        </TypeParentCont>
        <SelectLayersWrapper typeOfWindow="type">
          <SelectTypesList
            initData={initData}
            openselectlayer={openList}
            title={"Select Type"}
            onCloseHandler={() => {
              setOpenList(false);
            }}
            optionsList={initData.currentTypesList}
            onSelect={typeChange}
            anchorEl={anchorEl}
            open={open}
            handleClick={handleClick}
            handleClose={handleClose}
          />
        </SelectLayersWrapper>
      </ContainerDiv>
    </ClickAwayListener>
  );
};

export default Typebar;
