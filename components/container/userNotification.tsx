import React from 'react';
import { IUserNotification } from '../../models/IUserNotification';
import Moment from 'moment';
interface IProps {
  notifications: IUserNotification[];
  loadMoreData: () => void;
  updateNotifications: (notificationId: string) => void;
}
const UserNotification: React.FC<IProps> = ({
  notifications,
  loadMoreData,
  updateNotifications,
}) => {
  return (
    <React.Fragment>
      <div>
        <div className="p-2 ">
          {notifications &&
            notifications.map((notificationObj: IUserNotification) => {
              return (
                <div key={notificationObj.id}>
                  <div>
                    {notificationObj?.readAt ? (
                      <div className="m-0 border  border-gray-900 border-solid h-11/12  mt-3 text-center  bg-gray-300">
                        {notificationObj.message} <label>Read at:</label>
                        {Moment(notificationObj?.readAt).format(
                          'DD-MMM-YYYY hh:mm A'
                        )}
                      </div>
                    ) : (
                      <div
                        className="border  border-gray-900 border-solid h-11/12 w-full mt-3   text-center  bg-white"
                        onClick={() => {
                          updateNotifications(notificationObj.id);
                        }}
                      >
                        {notificationObj.message}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          <div className="text-center mt-3">
            <a className="font-bold text-blue-700" onClick={loadMoreData}>
              load More
            </a>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default UserNotification;
