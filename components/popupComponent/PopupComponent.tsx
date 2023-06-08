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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  fontWeight: "900",
  fontFamily: "Open Sans",

  "& .MuiDialogContent-root": {
    // padding: theme.spacing(2),
    padding: "0px",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
  },
  "& .MuiPaper-root.MuiDialog-paper": {
    // width: "493px",
    width: "585px",
    height: "360px",
  },
}));
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
  modalContent: any;
  projectId: string;
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
            marginRight: "22px",
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
    projectId,
  } = props;

  const handleClose = () => {
    setShowPopUp(false);
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <TextComponent>{modalTitle}</TextComponent>
        </BootstrapDialogTitle>
        {/* <DialogContent
          dividers
          style={{ borderBottom: 0, padding: "30px", paddingBottom: "22px" }}
        >
          <TextComponent>{modalmessage}</TextComponent>
        </DialogContent> */}

        <DialogContent
          dividers
          // style={{ borderBottom: 0, padding: "30px", paddingBottom: "22px" }}
        >
          {modalContent ? (
            modalContent
          ) : (
            <TextComponent>{modalmessage}</TextComponent>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: 0 }}>
          <ButtonDiv>
            <Button
              variant="text"
              autoFocus
              onClick={handleClose}
              style={{
                color: "#F1742E",
                width: "180px",
                height: "40px",
                textTransform: "none",
                marginBottom: "22px",
                fontFamily: "Open Sans",
              }}
            >
              {SecondaryButtonlabel}
            </Button>

            <Button
              variant="contained"
              onClick={() => callBackvalue()}
              style={{
                backgroundColor: "#F1742E",
                width: "180px",
                height: "40px",
                marginBottom: "22px",
                marginRight: "22px",
                textTransform: "none",
                fontFamily: "Open Sans",
                fontSize: "16px",
              }}
            >
              {primaryButtonLabel}
            </Button>
          </ButtonDiv>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};
export default PopupComponent;
