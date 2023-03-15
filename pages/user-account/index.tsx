import router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { toast } from 'react-toastify';
import ChangePassword from '../../components/container/changePassword';
import Header from '../../components/container/header';
import Notification from '../../components/container/userNotification';
import UserProfile from '../../components/container/userProfile';
import { IUser } from '../../models/IUser';
import { IUserNotification } from '../../models/IUserNotification';
import {
  getUserProfile,
  updateProfileAvatar,
  updateUserProfile,
} from '../../services/userAuth';
import {
  getAllUserNotifications,
  updateUserNotifications,
} from '../../services/userNotifications';
import { userNotificationData } from '../../utils/constants';
const Index: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [userDetails, setUserDetails] = useState<IUser>();
  const [notifications, setNotifications] = useState<IUserNotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);
  const [defaultValue, setDefaultValue] = useState(2);
  useEffect(() => {
    if (router.isReady) {
      getUserProfile()
        .then((response) => {
          if (response.success === true) {
            setUserDetails(response.result);
          }
        })
        .catch((error) => {
          toast.error('unable to load the data');
        });
      getUserNotifications();
    }
  }, []);
  const handleImageUPload = (e: any) => {
    const formData = new FormData();
    formData.append('file', e.file);
    updateProfileAvatar(formData).then((response) => {
      if (response.success === true) {
        toast.success('user profile pic updated successfully');
        setUserDetails(response?.result);
        const fileInput = document.getElementById(
          'file-upload'
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    });
  };
  const updateProfileInfo = (updateInfo: {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
  }) => {
    updateUserProfile(updateInfo)
      .then((response) => {
        if (response?.success === true) {
          setUserDetails(response?.result);
          toast.success('user profile updated successfully');
        }
      })
      .catch((error) => {
        if (error.success === false) {
          toast.error(error?.message);
        }
      });
  };
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
    <div>
      <div>
        <Header />
      </div>
      <div>
        <div className="w-full  calc-h overflow-y-auto ">
          <Tabs
            selectedIndex={tabIndex}
            onSelect={(index) => {
              setTabIndex(index);
            }}
          >
            <TabList>
              <Tab>User Profile</Tab>
              <Tab>change Password</Tab>
              <Tab>Notifications</Tab>
              <div
                className="absolute right-0 cursor-pointer font-bold decoration-4"
                onClick={() => {
                  router.back();
                }}
              >
                <button className="p-1 bg-gray-400 rounded-full">
                  Go Back
                </button>
              </div>
            </TabList>
            <div>
              <TabPanel>
                <UserProfile
                  userDetails={userDetails as IUser}
                  handleImageUPload={handleImageUPload}
                  updateProfileInfo={updateProfileInfo}
                />
              </TabPanel>
              <TabPanel>
                <ChangePassword />
              </TabPanel>
              <TabPanel>
                <label className="font-bold">Notifications</label>
                <select
                  id="options"
                  defaultValue={defaultValue}
                  onChange={handleOptionChange}
                  className="ml-2 border border-solid border-gray-500 w-1/4 px-2 py-1.5 rounded"
                >
                  {userNotificationData.map((noticationOptions) => {
                    return (
                      <option
                        value={noticationOptions.id}
                        key={noticationOptions.id}
                      >
                        {noticationOptions.name}
                      </option>
                    );
                  })}
                </select>
                <div className="w-1/2">
                  <Notification
                    notifications={notifications}
                    loadMoreData={loadMoreData}
                    updateNotifications={updateNotifications}
                  />
                </div>
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
