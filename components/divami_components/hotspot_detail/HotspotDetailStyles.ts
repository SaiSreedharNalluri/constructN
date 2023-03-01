import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box, Typography } from "@mui/material";

export const CustomHotspotDrawerContainer = styled("div")`
  width: 438px;
  height: calc(100vh - 61px);
`;

export const HeaderContainer = styled(Box)`
  background-color: white;
  height: 51px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
`;

export const TitleContainer = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`;

export const LeftTitleCont = styled("div")`
  display: flex;
  //   margin-top: 10px;
`;

export const ArrowIcon = styled(Image)`
  cursor: pointer;
  //   margin-right: 10px;
`;

export const SpanTile = styled("span")`
  //   color: #787878;

  margin-left: 10px;
`;
interface ContainerProps {
  footerState: boolean;
}

export const BodyContainer = styled(Box)<ContainerProps>`
  height: ${(props) =>
    props.footerState ? "calc(100% - 130px)" : "calc(100% - 50px)"};
  overflow-y: scroll;
`;

export const TabOneDiv = styled("div")`
  //   border: 2px solid pink;
  //   padding:30px;
`;

export const SecondBodyDiv = styled("div")`
  display: flex;
//   margin-top: 25px;
`;

export const SecondContPrior = styled("div")`
  width: 125px;
`;
export const ProgressTitle = styled("div")`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #ef8245;
`;

export const ProgressStatus = styled("div")`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #787878;
`;

export const SecondContPriorParal = styled("div")`
  width: 186px;
  // margin-left: auto;
`;

export const ThirdBodyDiv = styled("div")`
  margin-top: 25px;
`;

export const TitleDiv = styled("div")`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;

  color: #787878;
  width:186px;
   white-space: nowrap;
`;


export const SpanTitleDiv =styled("div")`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;

  color: #787878;
`;


export const ImageHeaderDiv = styled("div")`
  border: 1px solid #d9d9d9;
  display: flex;
  height: 150px;
  border-radius: 4px;
  margin-top:10px;
`;