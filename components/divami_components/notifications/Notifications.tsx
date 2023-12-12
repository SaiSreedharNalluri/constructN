import React, {useState } from "react";
import Body from "./body/Body";
import Header from "./header/Header";
import { styled } from "@mui/system";
import PopupComponent from "../../popupComponent/PopupComponent";
import { IUserNotification } from "../../../models/IUserNotification";
const StyledDiv = styled("span")({
  fontFamily: '"Open Sans"',
  display: "block",
  height: "calc(100vh - 60px)",
});
import Moment from "moment";

const Notifications = ({
    notifications,
    loadMoreData,
    updateNotifications,
    handleNotificationClose,filterValue,filterNotificationData
}:any) => {
  const [formData, setFormData] = useState<any>(null);
  const [validate, setValidate] = useState(false);
  const [showPopUp, setshowPopUp] = useState(false);
  const [canBeDisabled, setCanBeDisabled] = useState(false);
  const handleFormData = (data: any) => {
    setFormData(data);
  };
  
  let result: any = {};
  let today = Moment(new Date().toISOString().slice(0, 10)).format("DD MMM'YY");
  for (let i = 0; i < notifications?.length; i++) {
    let date = Moment(notifications[i].createdAt).format("DD MMM'YY");
    if (date === today) {
      date = "TODAY";
    }
    if (!result[date]) {
      result[date] = [];
    }
    result[date].push(notifications[i]);
  }
  notifications = result;
  const getNotifiCationTime = (olderTime: any) => {
    const date: any = new Date(olderTime);
    const currentDate: any = new Date();

    const diffInMilliseconds = currentDate - date;
    const diffInMinutes = Math.round(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const formattedTimeDifference =
      diffInHours > 0 ? `${diffInHours}h` : `${diffInMinutes}m`;
    return formattedTimeDifference;
  };
 
  
  return (
    <StyledDiv>
      <div className="px-4">
      <Header
        closeNotifications={handleNotificationClose}
      />
      </div>
      <Body
        handleFormData={handleFormData}
        validate={validate}
        setIsValidate={setValidate}
        setCanBeDisabled={setCanBeDisabled}
        notifications={notifications}
       loadMoreData={loadMoreData}
        updateNotifications={updateNotifications}
      getNotifiCationTime={getNotifiCationTime}
      filterNotificationData={filterNotificationData}
      filterValue={filterValue}
      />
      {showPopUp && (
        <PopupComponent
          open={showPopUp}
          setShowPopUp={setshowPopUp}
          modalTitle={"Cancel"}
          modalmessage={
             `Are you sure you want to cancel Notifications? `}
          primaryButtonLabel={"Yes"}
          SecondaryButtonlabel={"No"}
          callBackvalue={handleNotificationClose}
        />
      )}
    </StyledDiv>
  );
};

export default Notifications;
