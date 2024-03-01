import Image from "next/image";
import { useState } from "react";
import { ListItemIcon, Menu, Tooltip } from "@mui/material";
import {
  MenuOptionIcon,
  MenuOptionLabel,
  MenuOptionLabelField,
  StyledMenu,
} from "../issue-listing/IssueListStyles";
import { IconContainer } from "../task_list/TaskListStyles";
import { MenuWrapper } from "../project-users-list/ProjectUsersListStyles";
import { Mixpanel } from "../../analytics/mixpanel";

export const CustomMenu = ({
  imageSrc,
  menuOptions,
  width,
  height,
  right,
  data,
  id,
}: any) => {
  const [showMoreActions, setShowMoreActions] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClose = () => {
    setShowMoreActions(false);
    setAnchorEl(null);
  };
  const [isActive, setIsActive] = useState(false);
  const trackSortingEvent = (option: any) => {
    let sortingType = "";
    switch (option.method) {
      case "userAsc":
        sortingType = "user_inc";
        break;
      case "userDesc":
        sortingType = "user_desc";
        break;
      case "updatedAsc":
        sortingType = "last_updated_inc";
        break;
      case "updatedDesc":
        sortingType = "last_updated_desc";
        break;

      default:
        sortingType = option.method; 
        break;
    }

    Mixpanel.track({
      name: "sorting_type_clicked",
      project_id: "unknown",
      company_id: "unknown",
      screen_name: "projects_list_page",
      event_category: "sort",
      event_action: "sorting_type_clicked",
      user_id: "unknown",
      sorting_type:{ sortingType},
    });
  };
  return (
    <Tooltip title={"Sort"}>
    <MenuWrapper className={`${id} ${isActive ? "active" : ""} cursor-pointer`}>
      <Image
        src={imageSrc}
        alt=""
        width={width ? width : 20}
        height={height ? height : 20}
        style={
          right ? { marginRight: right, width: width, height: height } : {}
        }
        onClick={(e: any) => {
          setShowMoreActions(true);
          setAnchorEl(e.target);
          setIsActive(true);
        Mixpanel.track({name: "sort_clicked",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"sort",event_action:"sort_clicked",user_id:"unknown"})
        }}
      />
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={showMoreActions}
        onClose={() => {
          handleClose();
          setIsActive(false);
        }}
        onClick={(e) => {
          setShowMoreActions(false);
          setAnchorEl(null);
          setIsActive(false);
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
        {menuOptions.map((option: any,index:number) => {
          // Use a unique identifier if available, fallback to index if not
          const key = option.id ? `${option.id}-${index}` : index;
          return (
          <>
            <StyledMenu
              className="custom-styled-menu"
              key={key}
              onClick={() => {
                if (option.onClick) 
                {
                  trackSortingEvent(option);
                option.onClick();              
              }
                else if (option.action && data) {
                  option.action(data?._id);
                }
              }}
              data-testid="sort-menu-item"
            >
              {option.label}
              {option.icon && (
                <ListItemIcon>
                  <IconContainer src={option.icon} alt={option.label} />
                </ListItemIcon>
              )}
            </StyledMenu>
          </>
          );
        })}
      </Menu>
    </MenuWrapper>
    </Tooltip>
  );
};
