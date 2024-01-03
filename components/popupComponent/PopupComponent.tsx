import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import Image from "next/image";
import closeWithCircle from "../../public/divami_icons/closeWithCircle.svg";

export const CloseIcon = styled(Image)({
  cursor: "pointer",
});

export const BootstrapDialog = styled(Dialog)(
  ({ theme, width, height, paddingStyle, backdropWidth, showButton }: any) => ({
    fontWeight: "900",
    fontFamily: "Open Sans",

    "& .MuiDialogContent-root": {
      // padding: theme.spacing(2),
      padding: "0px",
    },
    "& .MuiDialogActions-root": {
      padding: paddingStyle ? "" : theme.spacing(1),
      paddingTop: showButton ? "30px" : "",
      display: "flex",

      justifyContent: paddingStyle ? "end" : "center",
    },
    "& .MuiPaper-root.MuiDialog-paper": {
      width: width ? width : "493px",
      height: height ? height : "",
      overflow:"hidden"
    },

    ".MuiBackdrop-root": {
      height: "calc(100% - 60px)",
      top: "auto !important",
      width:
        paddingStyle || backdropWidth
          ? "calc(100%) !important"
          : "calc(100% -59px)",
      right: "0 !important",
      left: "auto !important",
    },
  })
) as any;
const ButtonDiv = styled("div")({});

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  isUploader:boolean,
  onClose: () => void;
  hideCloseButton:boolean
}
export interface PopupComponentProps {
  modalTitle: string;
  modalmessage: string;
  primaryButtonLabel: string;
  SecondaryButtonlabel: string;
  callBackvalue?: any;
  setShowPopUp: (value: boolean) => void;
  open: boolean;
  modalContent?: any;
  hideButtons?: boolean;
  width?: string;
  height?: string;
  paddingStyle?: boolean;
  backdropWidth?: boolean;
  showButton?: boolean;
  setSelectedOption?: any;
  isImageThere?:boolean;
  imageSrc?:any;
  setShowbutton?: any;
  projectId?: string;
  isUploader?:boolean,
  isShowWarningText?:boolean,
  isCancelCallBack?:boolean
handleCancel?:(value:boolean)=>void
hideCloseButton?:boolean
}

export function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children,isUploader,hideCloseButton, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{ m: 0, p: 2 }}
      {...other}
      style={{
        fontFamily: "Open Sans",
        fontSize: "16px",

       
        // padding: "16px 0px 16px 30px",
        padding: "15px 0px 15px 20px",

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#101F4C",
      }}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "relative",
            right: 12,
            // top: 15,
            // top: 6,
            color: (theme) => theme.palette.grey[500],
            // marginRight: "12px",
            '&.MuiIconButton-root':{
              padding:0,
            },
          }}
        >
         {hideCloseButton===true ?<CloseIcon src={closeWithCircle} alt={"close icon"} />:isUploader===false?"":<CloseIcon src={closeWithCircle} alt={"close icon"} />}
          
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const TextComponent = styled(Typography)({
  fontSize: "16px",
  lineHeight: "21px",
  color: "#101F4C",
  fontFamily: "Open Sans",
});

const PopupComponent = (props: PopupComponentProps) => {
  const {
    modalTitle,
    modalmessage,
    primaryButtonLabel,
    SecondaryButtonlabel,
    callBackvalue,
    setShowPopUp,
    open,
    modalContent,
    hideButtons = false,
    paddingStyle,
    width,
    backdropWidth,
    showButton = true,
    setShowbutton,
    projectId,
    setSelectedOption,
    imageSrc,
    isImageThere,
    isUploader = true,
    isShowWarningText = true,
    handleCancel,
    isCancelCallBack,
    hideCloseButton=false
  } = props;
  const handleClosePopup=()=>{
    if(isUploader === false)
    {
      return
    }
    else{
      handleClose()
    }
  }
  const handleClose = () => {
    setShowPopUp(false);
    if (setSelectedOption) {
      setSelectedOption("issuePriority");
    }
    if (setShowbutton) {
      setShowbutton(false);
    }
  };
  return (
    <div>
      <BootstrapDialog
        onClose={handleClosePopup}
        aria-labelledby="customized-dialog-title"
        open={open}
        width={props.width}
        height={props.height}
        paddingStyle={props.paddingStyle}
        backdropWidth={props.backdropWidth}
        showButton={props.showButton}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={()=>{
            if(isCancelCallBack)
            {
              handleCancel?.(false)
            }
            else{
             handleClose() 
            }
          }}
          isUploader={isUploader}
          hideCloseButton={hideCloseButton}
        >
          {modalTitle}
        </BootstrapDialogTitle>
        <DialogContent
          dividers
          style={
            paddingStyle
              ? {}
              : { borderBottom: 0, padding: "30px", paddingBottom: "22px" }
          }
        >
          {modalContent ? (
            modalContent
          ) : (
            <TextComponent>{isImageThere? <div className="flex">
              <Image src={imageSrc} alt="" width={30} height={30}></Image><p className="ml-[10px] whitespace-pre-line">{ modalmessage}</p> </div>: <div className="whitespace-pre-line">{modalmessage}</div> }</TextComponent>
          )}
        </DialogContent>
        <DialogActions
          sx={
            showButton ? { height: "70px", paddingTop: "13px" } : { padding: 0 }
          }
        >
          {showButton ? (
            <ButtonDiv className="flex justify-evenly w-full">
             {SecondaryButtonlabel!=="" ?(   
              <Button
                variant={paddingStyle ? "outlined" : "text"}
                // autoFocus
                onClick={()=>{
                 
                  if(isCancelCallBack)
                  {
                    handleCancel?.(true)
                  }
                  else{
                    handleClose() 
                  }
                }}
                style={{
                  color: "#F1742E",
                  width: isUploader===false ? "fit-content":"180px",
                  height: "40px",
                  textTransform: "none",
                  marginBottom: "22px",
                  fontFamily: "Open Sans",
                  fontSize: "16px",
                  border: "1px solid #FF843F" 
                }}
              >
                {SecondaryButtonlabel}
              </Button>):""}

              <Button
                variant="contained"
                onClick={() => callBackvalue("Delete")}
                style={{
                  backgroundColor: "#FF843F",
                  color:"white",
                  width: isUploader && isShowWarningText ? "180px":"fit-content",
                  height: "40px",
                  marginBottom: "22px",
                  marginRight: "22px",
                  textTransform: "none",
                  fontFamily: "Open Sans",
                  fontSize: "16px",
                  marginLeft: paddingStyle ? "20px" : "",
                }}
              >
                {primaryButtonLabel}
              </Button>
            </ButtonDiv>
          ) : (
            <></>
          )}
        </DialogActions>
        {!isShowWarningText &&<p className="text-sm font-extralight italic p-2">* You can discard and retry a new upload with all files</p>}
      </BootstrapDialog>
    </div>
  );
};
export default PopupComponent;
