import React, { useEffect, useState } from 'react';
import { IUserNotification } from '../../models/IUserNotification';
import { getAllUserNotifications } from '../../services/userNotifications';
import { userNotificationData } from '../../utils/constants';
import Moment from 'moment';
const UserNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<IUserNotification[]>([]);
  useEffect(() => {
    getUserNotifications();
  }, []);
  const getUserNotifications = (condition = 1) => {
    getAllUserNotifications(condition)
      .then((response) => {
        setNotifications(response.result);
      })
      .catch((error) => {});
  };

  const handleOptionChange = (event: any) => {
    getUserNotifications(event.target.value);
  };
  return (
    <React.Fragment>
      <div>
        <label className="font-bold">Notifications</label>
        <select
          id="options"
          defaultValue={1}
          onChange={handleOptionChange}
          className="ml-2 border border-solid border-gray-500 w-1/4 px-2 py-1.5 rounded"
        >
          {userNotificationData.map((noticationOptions) => {
            return (
              <option value={noticationOptions.id} key={noticationOptions.id}>
                {noticationOptions.name}{' '}
              </option>
            );
          })}
        </select>
        <div className="p-2">
          {notifications &&
            notifications.map((notificationObj: IUserNotification) => {
              return (
                <div key={notificationObj.id}>
                  <p>
                    {notificationObj.message}
                    {notificationObj?.readAt &&
                      Moment(notificationObj?.readAt).format(
                        'DD-MMM-YYYY hh:mm A'
                      )}
                  </p>
                </div>
              );
            })}
          <a className="font-bold text-blue-700">load More</a>
        </div>
      </div>
    </React.Fragment>
  );
};
export default UserNotification;
