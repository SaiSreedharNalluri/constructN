import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import { fontSize } from "@mui/system";
import CrossIcon from "../../public/divami_icons/crossIcon.svg";
import Image from "next/image";
import ProjectConfig from "../divami_components/project_config/ProjectConfig";
import closeWithCircle from "../../public/divami_icons/closeWithCircle.svg";

export const CloseIcon = styled(Image)({
  cursor: "pointer",
});

const BootstrapDialog = styled(Dialog)(
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
  onClose: () => void;
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

  setShowbutton?: any;
  projectId?: string;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{ m: 0, p: 2 }}
      {...other}
      style={{
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
            position: "absolute",
            right: 8,
            // top: 15,
            top: 6,
            color: (theme) => theme.palette.grey[500],
            marginRight: "4px",
          }}
        >
          {/* <CloseIcon src={CrossIcon} alt={"close icon"} /> */}
          <CloseIcon src={closeWithCircle} alt={"close icon"} />
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
  } = props;

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
        onClose={handleClose}
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
          onClose={handleClose}
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
            <TextComponent>{modalmessage}</TextComponent>
          )}
        </DialogContent>
        <DialogActions
          sx={
            showButton ? { height: "70px", paddingTop: "13px" } : { padding: 0 }
          }
        >
          {showButton ? (
            <ButtonDiv>
              <Button
                variant={paddingStyle ? "outlined" : "text"}
                // autoFocus
                onClick={handleClose}
                style={{
                  color: "#F1742E",
                  width: "180px",
                  height: "40px",
                  textTransform: "none",
                  marginBottom: "22px",
                  fontFamily: "Open Sans",
                  border: paddingStyle ? "1px solid #F1742E" : "0px",
                }}
              >
                {SecondaryButtonlabel}
              </Button>

              <Button
                variant="contained"
                onClick={() => callBackvalue("Delete")}
                style={{
                  backgroundColor: "#F1742E",
                  width: "180px",
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
      </BootstrapDialog>
    </div>
  );
};
export default PopupComponent;
