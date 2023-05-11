/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "../../components/divami_components/header/Header";
import { IUserNotification } from "../../models/IUserNotification";
import Notification from "../../components/container/userNotification";
import {
  getAllUserNotifications,
  updateUserNotifications,
} from "../../services/userNotifications";
import router from "next/router";
import { userNotificationData } from "../../utils/constants";
const UserNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<IUserNotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);
  const [defaultValue, setDefaultValue] = useState(2);
  useEffect(() => {
    if (router.isReady) {
      getUserNotifications();
    }
  }, []);
  const getUserNotifications = (condition = defaultValue) => {
    getAllUserNotifications(condition, currentPage)
      .then((response) => {
        if (notifications.length > 0 && currentPage > 1) {
          setNotifications(notifications.concat(response.result));
          setTotalNotifications(response.totalUserNotifications);
        } else {
          setNotifications(response.result);
          setTotalNotifications(response.totalUserNotifications);
        }
      })
      .catch((error) => {});
  };

  const handleOptionChange = (event: any) => {
    setNotifications(notifications.splice(0, notifications.length));
    getUserNotifications(event.target.value);
    setDefaultValue(event.target.value);
    setCurrentPage(1);
  };
  const loadMoreData = () => {
    if (currentPage < totalNotifications / 10) {
      setCurrentPage(currentPage + 1);
    }
  };
  useEffect(() => {
    getUserNotifications(defaultValue);
  }, [currentPage, defaultValue]);
  const updateNotifications = (notificationId: string) => {
    updateUserNotifications([notificationId]).then((response) => {
      if (response.success === true) {
        setNotifications(notifications.splice(0, notifications.length));
        getUserNotifications(defaultValue);
        setCurrentPage(1);
      }
    });
  };
  return (
    <React.Fragment>
      <div>
        <Header />
      </div>
      <div
        className="ml-1 mt-1 p-2 font-bold text-blue-700"
        onClick={() => {
          router.back();
        }}
      >
        Back
      </div>
      <label className="font-bold text-lg p-2">Notifications</label>
      <select
        id="options"
        defaultValue={defaultValue}
        onChange={handleOptionChange}
        className=" mr-3 right-0 p-2 absolute border border-solid border-gray-500  px-2 py-1.5 rounded"
      >
        {userNotificationData.map((noticationOptions) => {
          return (
            <option value={noticationOptions.id} key={noticationOptions.id}>
              {noticationOptions.name}
            </option>
          );
        })}
      </select>
      <div className="w-full overflow-y-auto h-87 pl-10 pr-10">
        <Notification
          notifications={notifications}
          loadMoreData={loadMoreData}
          updateNotifications={updateNotifications}
        />
      </div>
    </React.Fragment>
  );
};
export default UserNotification;
