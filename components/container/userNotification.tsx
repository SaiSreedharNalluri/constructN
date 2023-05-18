import React from "react";
import { IUserNotification } from "../../models/IUserNotification";
import Moment from "moment";
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
  let result: any = {};
  let today = Moment(new Date().toISOString().slice(0, 10)).format("DD MMM'YY");
  for (let i = 0; i < notifications.length; i++) {
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
    <React.Fragment>
      <div>
        {Object.keys(notifications).length > 0 &&
          Object.keys(notifications).map((date: any) => (
            <div key={date} className="border px-2 py-2">
              <h3 className="text-base font-bold ml-2  p-3">{date}</h3>
              <ul>
                {notifications[date].map(
                  (notificationObj: IUserNotification) => {
                    return (
                      <div key={notificationObj.id}>
                        <div>
                          {notificationObj?.readAt ? (
                            <div className="m-0 border-b flex justify-between border-gray-100 h-11/12 text-center text-base">
                              <div className="ml-2 p-2">
                                {notificationObj.message}
                              </div>
                              {date === "TODAY" ? (
                                <div className="mr-3">
                                  {getNotifiCationTime(
                                    notificationObj?.createdAt
                                  )}
                                </div>
                              ) : (
                                <div className="mr-3">
                                  {Moment(notificationObj?.createdAt).format(
                                    "hh:mm A"
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div
                              className="border-b flex justify-between border-gray-500  h-11/12 w-full text-center  bg-gray-100 text-base"
                              onClick={() => {
                                updateNotifications(notificationObj.id);
                              }}
                            >
                              <div className="ml-3 p-2">
                                {notificationObj.message}
                              </div>
                              {date === "TODAY" ? (
                                <div className="mr-3">
                                  {getNotifiCationTime(
                                    notificationObj?.createdAt
                                  )}
                                </div>
                              ) : (
                                <div className="mr-3">
                                  {Moment(notificationObj?.createdAt).format(
                                    "hh:mm A"
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </ul>
            </div>
          ))}
        {Object.keys(notifications).length > 0 ? (
          <div className="text-center">
            <a className="font-bold text-orange-400" onClick={loadMoreData}>
              load More
            </a>
          </div>
        ) : (
          <div>
            <h1 className=" absolute  top-1/2 bg-opacity-50 left-1/3 rounded p-2  bg-gray-300 text-orange-400 ">
              There is no data avalible to display
            </h1>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
export default UserNotification;
