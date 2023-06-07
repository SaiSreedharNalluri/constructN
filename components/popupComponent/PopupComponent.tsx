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

export const CloseIcon = styled(Image)({
  cursor: "pointer",
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  fontWeight: "900",
  fontFamily: "Open Sans",

  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
  },
  "& .MuiPaper-root.MuiDialog-paper": {
    width: "493px",
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
  modalContent?: any;
  hideButtons?: boolean;
}
function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{ m: 0, p: 2 }}
      {...other}
      style={{
        fontSize: "16px",
        padding: "16px 0px 16px 30px",
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
            top: 15,
            color: (theme) => theme.palette.grey[500],
            marginRight: "22px",
          }}
        >
          <CloseIcon src={CrossIcon} alt={"close icon"} />
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
    modalContent,
    primaryButtonLabel,
    SecondaryButtonlabel,
    callBackvalue,
    setShowPopUp,
    open,
    hideButtons = false,
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
          {modalTitle}
        </BootstrapDialogTitle>
        <DialogContent
          dividers
          style={{ borderBottom: 0, padding: "30px", paddingBottom: "22px" }}
        >
          {modalContent ? (
            modalContent
          ) : (
            <TextComponent>{modalmessage}</TextComponent>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: 0 }}>
          {!hideButtons ? (
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
