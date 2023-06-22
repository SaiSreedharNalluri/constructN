import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box, Select, TextField, Typography, MenuItem } from "@mui/material";
import { TabPanel } from "@mui/lab";
import { Height } from "@mui/icons-material";
// import {  MenuItem } from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export const HeaderContainer = styled(Box)`
  background-color: white;
  height: 51px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
   
`;

export const TitleContainer = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  color: "#36415D",
  fontFamily: "Open Sans",
  fontStyle: "normal",
  fontWeight: "400",
  fontSize: "16px",

  // position:"fixed"
});

export const CloseIcon = styled(Image)`
  cursor: pointer;
`;
export const ArrowIcon = styled(Image)`
  cursor: pointer;
  //   margin-right: 10px;
`;

export const EditIcon = styled(Image)`
  cursor: pointer;
  // margin-right: 20px;
  //   width: 24px;
  // height: 24px;
`;

export const DeleteIcon = styled(Image)`
  cursor: pointer;
  // width: 24px;
  // height: 24px;
  // margin-right: 25px;
  
`;

export const LeftTitleCont = styled("div")`
  display: flex;
  //   margin-top: 10px;
`;

export const RightTitleCont = styled("div")`
  display: flex;

  //   margin-top: 10px;
`;

export const SpanTile = styled("span")`
  //   color: #787878;

  margin-left: 10px;
`;

export const TabOneDiv = styled("div")`
  //   border: 2px solid pink;
  //   padding:30px;
`;

export const FirstHeaderDiv = styled("div")`
  border: 1px solid #d9d9d9;
  display: flex;
  height: 150px;
  border-radius: 4px;
`;

export const SecondBodyDiv = styled("div")`
  //   display: flex;
  margin-top: 25px;
`;

export const PriorityTitle = styled("div")`
 width: 88px;
  margin-right: 130px;
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;
export const TypeTitle = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

export const PriorityStatus = styled("div")`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #101f4c;
  // margin-top: 5px;
`;

export const TypeStatus = styled("div")`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

export const SecondContType = styled("div")`
  width: 186px;
`;

export const SecondContPrior = styled("div")({
  display: "flex",
  // justifyContent:"space-between",
  // width: "210px",
  // border:"1px solid red"
});

export const SecondContPriorParal = styled("div")({
  display: "flex",
  // justifyContent:"space-between",
  // width: "210px",
});

export const SecondContDueDate = styled("div")({
  display: "flex",
  // justifyContent:"space-between",
  // width: "210px",
});

export const SecondContCapt = styled("div")({
  display: "flex",
  // justifyContent:"space-between",
  // width: "210px",
});

export const CaptureTitle = styled("div")`
  width: 88px;
  margin-right: 130px;
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

export const CaptureStatus = styled("div")`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  // margin-top: 5px;
`;

export const ThirdContWatch = styled("div")`
width: 88px;
  margin-right: 130px;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #787878;
`;
export const DueDateTitle = styled("div")`
width: 88px;
  margin-right: 130px;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #787878;
`;
export const ThirdContWatchName = styled("div")`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #101f4c;
  // margin-top: 5px;
`;
export const ThirdContDueDate = styled("div")`
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #101f4c;
  // margin-top: 5px;
`;

export const ThirdContProg = styled("div")`
  width: 88px;
  margin-right: 130px;
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

export const ThirdContProgType = styled("div")`
  display: flex;
  align-items: center;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  color: #101f4c;
  // margin-top: 5px;
`;

export const ThirdBodyDiv = styled("div")`
  display: flex;
  margin-top: 25px;
`;

export const ThirdContLeft = styled("div")`
  margin-right: 100px;
`;

export const ThirdContRight = styled("div")({
  display:"flex"
})

export const PenIconImage = styled(Image)`
  cursor: pointer;
  margin-left: 9px;
`;

export const ToolIconImage = styled(Image)`
  cursor: pointer;
  // margin-left: 9px;
`;

export const MoreText = styled("div")`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #f1742e;
  // margin-left: 5px;
  cursor: pointer;
 
`;

export const FourthContLeft = styled("div")({
  display:"flex"
})

export const FourthContAssigned = styled("div")`
 width: 88px;
  margin-right: 130px;
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;
export const FourthContMoreText = styled("div")({
  
  
  marginTop:"1px"
})
export const MoreTextDiv = styled("div")({
  
})
export const ParentFourthContMoreText = styled("div")({
  display:"flex"
})

export const FourthContProgType = styled("div")`
  display: flex;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  color: #101f4c;
  align-items: center;
  // margin-top: 5px;
`;

export const FormElementContainer = styled(Box)`
  margin-top: 25px;
`;

export const DescriptionDiv = styled("div")`
  margin-top: 25px;
`;

export const DescriptionTitle = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

export const DescriptionPara = styled("div")`
  margin-top: 5px;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  color: #101f4c;
`;

export const AttachmentDiv = styled("div")`
  margin-top: 25px;
`;

export const AttachmentTitle = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

export const AttachmentDescription = styled("div")`
  margin-top: 10px;
  margin-bottom: 15px;
  margin-left: -20px;
  width: 430px;
  color: #101f4c;
  font-size: 14px;
  line-height: 20px;
  font-family: "Open Sans";
  font-weight: 400;
`;

export const AttachedImageDiv = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const AttachedImageTitle = styled("div")`
  margin-left: 21px;
  cursor: pointer;
`;

export const AttachedImageIcon = styled("div")``;

export const AttachHorizontal = styled("div")`
  border-bottom: 1px solid #d9d9d9;
  //   margin-top: 15px;
  //   margin-bottom: 15px;
`;

export const RelatedDiv = styled("div")`
  margin: 25px 0px;
`;

export const RelatedTagTitle = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
`;

export const RelatedTagsButton = styled("div")`
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  flex-wrap: wrap;
`;

export const RelatedSingleButton = styled("div")`
  border: 1px solid #101f4c;
  padding: 8px 22px;
  border-radius: 40px;
  height: 32px;
  white-space: nowrap;
  font-size: 12px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-family: Open Sans;
  font-style: normal;
`;

export const StyledLabel = styled(Typography)`
  font-weight: 400;
  line-height: 20px;
  font-size: 14px;
  margin-bottom: 8px;
`;

export const CustomTaskDrawerContainer = styled("div")({
  width: "438px",
  height: "calc(100vh - 60px)",
  paddingLeft: "20px",
  paddingRight: "20px",
  // border: "2px solid blue",
  overflow:"hidden"
});

export const ProgressEditStateButtonsContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  margin: 20px;
  background: white;
  width: 90%;
`;

export const AssignEditSearchContainer = styled("div")({
  minHeight: "40px",
  marginTop: "20px",
  "& .MuiAutocomplete-root": {
    height: "100%",
    width: "100%",
  },
  "& .MuiFormControl-root.MuiFormControl-fullWidth.MuiTextField-root.css-wb57ya-MuiFormControl-root-MuiTextField-root":
    {
      height: "100%",
      width: "100%",
    },
  "& .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-fullWidth.MuiInputBase-formControl.MuiInputBase-adornedEnd.MuiAutocomplete-inputRoot.css-154xyx0-MuiInputBase-root-MuiOutlinedInput-root":
    {
      height: "100%",
      width: "100%",
    },
  "& .MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input": {
    marginTop: "-8px",
  },
  "& .MuiAutocomplete-root fieldset": {
    borderColor: "#36415D !important",
  },
});

export const CustomTabPanel = styled(TabPanel)`
  padding: none;
`;

export const CustomSelectContainer = styled("div")`
  width: 398px;
`;

export const StyledSelect = styled(Select)`
  width: 100%;
  height: 40px;
  outline: 0px;
  border: 1px solid #36415d;
  border-radius: 4px;
  & .MuiOutlinedInput-notchedOutline {
    border: 0;
    offset: 0;
  }
`;

interface ContainerProps {
  footerState: boolean;
}

export const BodyContainer = styled(Box)<ContainerProps>`
  height: ${(props) =>
    props.footerState ? "calc(100% - 130px)" : "calc(100% - 50px)"};
  overflow-y: scroll;
`;

export const FourthBodyDiv = styled("div")((props: any) => ({
  display: props.assigneeEditState ? "none" : "flex",
  marginTop: "25px",
})) as any;

export const AddCommentContainer = styled("div")((props: any) => ({
  // borderTop: `${props.containerType === "float" ? "none" : "1px solid #D9D9D9"}`,
  height: `${props.containerType === "float" ? "80px" : "50px"}`,
  display: "flex",
  position: "absolute",
  bottom: "0",
  background: "white",
  marginLeft: "-24px",
  width: "100%",
})) as any;

export const AddCommentContainerSecond = styled("div")({
  height: "50px",
  display: "flex",
  alignItems: "center",
  // justifyContent: "space-around",
  paddingLeft: "20px",
  border: "1px solid #D9D9D9",
  width: "100%",
  position: "absolute",
  bottom: "0",
  background: "white",
  marginLeft: "-24px",
});

export const AddCommentInput = styled("input")({
  width: "100%",
  paddingLeft: "10px",
});
export const ActivityLogContainer = styled("div")({
  // marginBottom: "40px",
  marginBottom: "26px",
});

export const AddCommentButtonContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginLeft: "auto",
});

export const AttachButton = styled("button")({
  width: "48px",
  display: "flex",
  justifyContent: "center",
  height: "60%",
  borderRight: "1px solid #D9D9D9",
  marginTop: "auto",
  marginBottom: "auto",
});

export const ImageErrorIcon = styled(Image)({
  cursor: "pointer",
  width: "24px",
  height: "24px",
});

export const SendButton = styled("button")({
  width: "48px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const ProgressStateFalse = styled("div")({
  // display: "flex",
  marginTop: "20px",
});

export const ProgressStateTrue = styled("div")({
  display: "flex",
  marginTop: "20px",
});

export const ProgressCustomSelect = styled("div")({
  marginTop: "20px",
});

export const AssigneeCustomSelect = styled("div")({
  marginTop: "20px",
});

export const ValueContainer = styled("div")(({ theme }) => ({
  "& > :not(:last-child)": {
    marginRight: theme.spacing(1),
  },
  "& > *": {
    marginBottom: theme.spacing(1),
  },
  marginTop: "15px",
}));

export const StyledInput = styled(TextField)(({ theme }) => ({
  color: "blue",
  width: "100% !important",
  "label + &": {
    marginTop: theme.spacing(8),
  },

  "& .MuiFormControl-root-MuiTextField-root": {
    width: "100%",
  },

  "& .MuiInputBase-input-MuiInput-input": {
    ":after": {
      width: "100%",
    },
  },

  "& .MuiInput-root": {
    "&:before, :after, :hover:not(.Mui-disabled):before": {
      borderBottom: 0,
    },
  },
  "&& .MuiInput-underline": {
    borderBottom: "none",
    // borderBottomColor: "none",
  },
  "& .MuiInput-underline:after": {
    borderBottom: "none",
    // borderBottomColor: "none",
  },

  "& .MuiInputBase-input": {
    "&::placeholder": {
      color: "#787878",
      fontFamily: "Open Sans",
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: "400",
    },
  },
}));

export const StyledMenu = styled(MenuItem)({
  borderBottom: "1px solid #D9D9D9",
  width: "178px",
  margin: "0px 20px",
  "&:hover": {
    cursor: "pointer",
  },
  padding: 0,
  height: "38px",
  fontSize: "14px",
});

export const IconContainer = styled(Image)({
  cursor: "pointer",
  marginLeft: "16px",
});

export const AssigneeList = styled("div")({
  // display: "inline-block",

  // background:"#FFFFF"
  // width: "308px",
  // height: "86px",
  fontFamily: "Open Sans",

  fontStyle: "normal",
  fontSize: "14px",
  padding: "15px",
  color: "#101F4C",
  border: "1px solid #D9D9D9",
  marginTop: "-3px",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.16)",
  borderRadius: "4px",
  // position: "absolute",
  // right:"10px",
});

export const SecondAssigneeList = styled("div")({
  // display: "inline-block",

  background: "white",
  // width: "308px",
  // height: "86px",
  padding: "15px",
  color: "#101F4C",
  fontSize: "14px",
  border: "1px solid #D9D9D9",
  // marginTop: '-3px',
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.16)",
  borderRadius: "4px",
  // position: "absolute",
  // right:"10px",
});

export const ParentAssigneeList = styled("div")({
  // dissplay: "inline-block",
  display: "flex",
  flexDirection: "row",
});

export const ExtraLabel = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  margin-bottom: 10px;
`;

export const AssignedLabel = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  margin-bottom: 10px;
`;
