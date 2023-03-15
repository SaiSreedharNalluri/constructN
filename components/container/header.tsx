import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faQuestion,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getCookie, removeCookies } from 'cookies-next';
import { IUser } from '../../models/IUser';
import UserNotification from './userNotification';
import { IUserNotification } from '../../models/IUserNotification';
import {
  getAllUserNotifications,
  updateUserNotifications,
} from '../../services/userNotifications';
interface IProps {
  breadCrumb?: string;
}
const Header: React.FC<IProps> = ({ breadCrumb }) => {
  const router = useRouter();
  const headerRef: any = React.useRef();
  let [user, setUser] = useState<IUser>();
  const [breadCrumbString, setBreadCrumbString] = useState(breadCrumb || '');
  const [notifications, setNotifications] = useState<IUserNotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);
  useEffect(() => {
    const userObj: any = getCookie('user');
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if (user?.fullName) {
      setUser(user);
    }
    getUserNotifications();
  }, [router.query.projectId, router.isReady]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (breadCrumb !== undefined) setBreadCrumbString(breadCrumb);
    else setBreadCrumbString('');
  }, [breadCrumb]);

  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const closePopup = (e: any) => {
      if (!headerRef.current.contains(e.target)) {
        setLoading(false);
        setOpen(false);
      }
    };
    document.addEventListener('click', closePopup);
    return () => {
      document.removeEventListener('click', closePopup);
    };
  }, []);
  const getUserNotifications = (condition = 1) => {
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
  const userLogOut = () => {
    removeCookies('user');
    router.push('/login');
  };
  const goToProjectsList = () => {
    router.push('/projects');
  };
  const loadMoreData = () => {
    if (currentPage < totalNotifications / 10) {
      setCurrentPage(currentPage + 1);
    }
  };
  useEffect(() => {
    getUserNotifications();
  }, [currentPage]);
  const updateNotifications = (notificationId: string) => {
    updateUserNotifications([notificationId]).then((response) => {
      if (response.success === true) {
        setNotifications(notifications.splice(0, notifications.length));
        getUserNotifications();
        setCurrentPage(1);
      }
    });
  };
  return (
    <React.Fragment>
      <div ref={headerRef}>
        <header className="border-b border-solid border-gray-400">
          <div className="flex justify-between">
            <div className="ml-2 mt-2 mb-2 ">
              <img
                onClick={goToProjectsList}
                className=" cursor-pointer h-6"
                src="https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/defaults/projectCoverPhoto.webp"
                alt=""
              ></img>
            </div>
            <div className="flex-auto text-sm p-2">{breadCrumbString}</div>
            <div className="flex ">
              <div className="mt-2 mr-2 mb-2 w-6 h-6">
                <FontAwesomeIcon
                  icon={faBell}
                  onClick={() => {
                    if (open) {
                      setOpen(false);
                    } else {
                      setOpen(true);
                    }
                  }}
                />
                {open && (
                  <div className="absolute top-10 right-0 z-50 bg-gray-200 rounded-lg shadow border">
                    <div className="w-full h-full mt-2 mr-2 mb-2 font-medium overflow-auto">
                      <h1 className="ml-2">Notifications</h1>
                      <UserNotification
                        notifications={notifications}
                        loadMoreData={loadMoreData}
                        updateNotifications={updateNotifications}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div
                onClick={() => {
                  if (!loading) {
                    setLoading(true);
                  } else {
                    setLoading(false);
                  }
                }}
              >
                <div className="w-6 h-6 mt-2 mr-2 mb-2 rounded-full overflow-hidden border-1 border-gray-900">
                  <Image
                    src={
                      user && user.avatar
                        ? user.avatar
                        : 'https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/defaults/user_icon_def_01.png'
                    }
                    alt=""
                    className={`w-full h-full cursor-pointer object-cover `}
                    height={1920}
                    width={1080}
                  />
                </div>
              </div>
              {loading && (
                <div className="absolute top-10 right-0 z-50 bg-gray-800 rounded-lg shadow border">
                  <ul className="text-white p-4 ">
                    <li className="font-medium">
                      <div className="flex flex-col items-center justify-center transform transition-colors duration-200">
                        <div className="w-11 h-11 mt-2 mr-2 mb-2 rounded-full overflow-hidden border-1 border-gray-900">
                          <Image
                            src={
                              user && user.avatar
                                ? user.avatar
                                : 'https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/defaults/user_icon_def_01.png'
                            }
                            alt=""
                            className={`w-full h-full cursor-pointer object-cover `}
                            height={1920}
                            width={1080}
                            onClick={() => router.push(`/user-account`)}
                          />
                        </div>
                        <div className="text-base font-bold">
                          {user?.fullName}
                        </div>
                        <div className="text-xs italic font-thin">
                          {user?.email}
                        </div>
                        <div
                          className="cursor-pointer font-bold"
                          onClick={() => router.push(`/user-account`)}
                        >
                          Manage Account
                        </div>
                      </div>
                    </li>
                    <hr className="border-gray-700" />
                    <li
                      className="font-medium cursor-pointer"
                      onClick={() => router.push(`/support`)}
                    >
                      <div className="flex items-center justify-center transform transition-colors duration-200 ">
                        <div className="mr-3">
                          <FontAwesomeIcon icon={faQuestion} />
                        </div>
                        Support
                      </div>
                    </li>
                    <hr className="border-gray-700" />
                    <li
                      className="font-medium cursor-pointer"
                      onClick={() => userLogOut()}
                    >
                      <div className="flex items-center justify-center transform transition-colors duration-200 ">
                        <div className="mr-3 ">
                          <FontAwesomeIcon
                            icon={faRightFromBracket}
                          ></FontAwesomeIcon>
                        </div>
                        Logout
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>
    </React.Fragment>
  );
};
export default Header;
