import React from "react";
import Image from "next/image";
import downArrowIcon from "../../../public/divami_icons/downArrowIcon.svg";
import { TypeParentCont, TypesTitle, TypeArrowIconDiv } from "./ToolBarStyles";

// import styles from '../toolbar/toolbar.module.css'

const Typebar = () => (
  <TypeParentCont>
    <TypesTitle>OrthType</TypesTitle>
    <TypeArrowIconDiv>
      <Image src={downArrowIcon} width={12} height={12} alt="Arrow" />
    </TypeArrowIconDiv>
  </TypeParentCont>
);

export default Typebar;
