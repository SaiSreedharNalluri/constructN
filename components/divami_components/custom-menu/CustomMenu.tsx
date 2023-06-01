import Image from "next/image";
import { useState } from "react";
import { Menu } from "@mui/material";
import { StyledMenu } from "../issue-listing/IssueListStyles";

export const CustomMenu = ({ imageSrc, menuOptions }) => {
  const [showMoreActions, setShowMoreActions] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => {
    setShowMoreActions(false);
    setAnchorEl(null);
  };
  return (
    <>
      <Image
        src={imageSrc}
        alt=""
        width={20}
        height={20}
        onClick={(e) => {
          setShowMoreActions(true);
          setAnchorEl(e.target);
        }}
      />
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={showMoreActions}
        onClose={() => {
          handleClose();
        }}
        onClick={(e) => {
          setShowMoreActions(false);
          setAnchorEl(null);
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menuOptions.map((option: any) => (
          <>
            <StyledMenu
              className="custom-styled-menu"
              key={option.label}
              onClick={() => option.onClick()}
              data-testid="sort-menu-item"
            >
              {option.label}
            </StyledMenu>
          </>
        ))}
      </Menu>
    </>
  );
};
