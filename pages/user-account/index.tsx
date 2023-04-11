import router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { toast } from 'react-toastify';
import ChangePassword from '../../components/container/changePassword';
import Header from '../../components/container/header';
import Notification from '../../components/container/notification';
import UserProfile from '../../components/container/userProfile';
import { IUser } from '../../models/IUser';
import {
  getUserProfile,
  updateProfileAvatar,
  updateUserProfile,
} from '../../services/userAuth';
const Index: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [userDetails, setUserDetails] = useState<IUser>();
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
                <Notification />
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
