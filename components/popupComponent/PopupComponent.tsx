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
import Image from 'next/image';

export const CloseIcon = styled(Image)({
  cursor: 'pointer',
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiPaper-root.MuiDialog-paper": {
    width: "493px",
  }
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
}
function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{ m: 0, p: 2 }}
      {...other}
      style={{
        fontSize: "16px",
        padding: "16px",
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
          }}
        >
          <CloseIcon
            src={CrossIcon}
            alt={"close icon"}
          />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
const PopupComponent = (props: PopupComponentProps) => {
  const {
    modalTitle,
    modalmessage,
    primaryButtonLabel,
    SecondaryButtonlabel,
    callBackvalue,
    setShowPopUp,
    open
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
        <DialogContent dividers style={{ borderBottom: 0 }}>
          <Typography gutterBottom>{modalmessage}</Typography>
        </DialogContent>
        <DialogActions>
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
                marginBottom: "30px",
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
                marginBottom: "30px",
                marginRight: "30px",
                textTransform: "none",
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
