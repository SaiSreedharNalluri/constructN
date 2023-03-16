import { styled } from "@mui/system";
import { Theme } from "../../../styles/globalStyles";
import Image from "next/image";
import { Box, TextField, Typography } from "@mui/material";


interface ContainerProps {
  footerState: boolean;
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

export const TitleContainer = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`;

export const CloseIcon = styled(Image)`
  cursor: pointer;
`;
export const ArrowIcon = styled(Image)`
  cursor: pointer;
  //   margin-right: 10px;
`;

export const EditIcon = styled(Image)`
  cursor: pointer;
  margin-right: 20px;
`;

export const DeleteIcon = styled(Image)`
  cursor: pointer;
  width:24px;
  height:24px;
    margin-right: 10px;
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
  display: flex;
  margin-top: 25px;
`;

export const PriorityTitle = styled("div")`
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
  margin-top:5px;
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

export const SecondContPrior = styled("div")`
  width: 186px;
`;

export const SecondContPriorParal = styled("div")`
  width: 186px;
  margin-left:auto;
`;

export const SecondContCapt = styled("div")`
  width: 186px;
`;

export const CaptureTitle = styled("div")`
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
  margin-top:5px;
`;

export const ThirdContWatch = styled("div")`
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
  margin-top:5px;
`;

export const ThirdContProg = styled("div")`
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
  margin-top:5px;
`;

export const ThirdBodyDiv = styled("div")`
  display: flex;
  margin-top: 25px;
`;

export const ThirdContLeft = styled("div")`
  margin-right: 100px;
`;

export const ThirdContRight = styled("div")`
  // flex: 1;
  width: 186px;
`;

export const PenIconImage = styled(Image)`
  cursor: pointer;
  margin-left: 9px;
`;



export const MoreText = styled("div")`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #ff843f;
  margin-left: 5px;
`;

export const FourthContLeft = styled("div")`
  width: 186px;
  margin-left:auto;
`;

export const FourthContAssigned = styled("div")`
  font-family: "Open Sans";
  color: #787878;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
 
`;

export const FourthContProgType = styled("div")`
  display: flex;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  color: #101f4c;
  align-items: center;
  margin-top:5px;
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
font-family: 'Open Sans';
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 20px;


color: #101F4C;

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
  margin-top: 8px;
  flex-wrap: wrap;
`;

export const RelatedSingleButton = styled("div")`
  border: 1px solid black;
  padding: 8px 22px;
  border-radius: 40px;
  height: 32px;
  white-space: nowrap;
  font-size: 12px;
  margin-right: 10px;
  margin-bottom: 10px;
`;

export const StyledLabel = styled(Typography)`
  font-weight: 400;
  line-height: 20px;
  font-size: 14px;
  margin-bottom: 8px;
`;

export const CustomTaskDrawerContainer = styled("div")`
  width: 438px;
  height: calc(100vh - 61px);
`;

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

export const  AddCommentContainerSecond = styled("div")({
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
  paddingLeft: "20px",
  fontFamily: "Open Sans",
  fontSize: "14px",
});


export const AddCommentButtonContainer = styled("div")({
  display: "flex",
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

export const SendButton = styled("button")({
  width: "48px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const ProgressStateFalse = styled("div")({
  display: "flex",
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

export const ImageErrorIcon = styled(Image)({
  cursor: "pointer",
  width: "24px",
  height: "24px",
});


export const StyledInput = styled(TextField)(({ theme }) => ({
  color: "blue",
  "label + &": {
    marginTop: theme.spacing(8),
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
    },
  },
}));