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
import {
  userNotificationData,
  userNotificationTypes,
} from "../../utils/constants";

const UserNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<IUserNotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);
  const [defaultValue, setDefaultValue] = useState(2);
  const [filterValue, setFilterValue] = useState("All");
  useEffect(() => {
    if (router.isReady) {
      getUserNotifications();
    }
  }, []);
  const getUserNotifications = (
    condition = defaultValue,
    eventEmitter = filterValue
  ) => {
    if (eventEmitter === "All") {
      eventEmitter = "";
    }
    getAllUserNotifications(condition, currentPage, eventEmitter)
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
    setFilterValue("All");
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
  const filterNotificationData = (filterData: any) => {
    setFilterValue(filterData);
    setCurrentPage(1);
  };
  useEffect(() => {
    getUserNotifications(defaultValue, filterValue);
  }, [filterValue]);
  return (
    <React.Fragment>
      <div>
        <Header />
      </div>
      {/* <div
        className=" p-3 font-bold text-blue-700"
        onClick={() => {
          router.back();
        }}
      >
        Back
      </div> */}
      <h1 className="font-bold text-lg ml-6 p-4 ">Notifications</h1>
      {/* <select
        id="options"
        defaultValue={defaultValue}
        onClick={handleOptionChange}
        className="mr-3 right-0 p-2 absolute border border-solid border-gray-500  px-2 py-1.5 rounded"
      >
        {userNotificationData?.map((noticationOptions) => {
          return (
            <option value={noticationOptions.id} key={noticationOptions.id}>
              {noticationOptions.name}
            </option>
          );
        })}
      </select> */}
      <div className="right-0 top-14 mt-1 mr-5 absolute p-4">
        {userNotificationTypes.map((notificationObj: any) => {
          return (
            <button
              type="button"
              className={`${"ml-2 hover:bg-gray-400 border font-semibold hover:text-white py-1 px-4   hover:border-transparent rounded-full"} ${
                filterValue === notificationObj.id
                  ? "bg-orange-400 text-white"
                  : "border-gray-400 text-gray-700"
              }`}
              key={notificationObj.id}
              onClick={() => {
                filterNotificationData(notificationObj.id);
              }}
            >
              {notificationObj.name}
            </button>
          );
        })}
      </div>

      <div className="w-full overflow-y-auto h-87 pl-10 pr-10 pb-6">
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
