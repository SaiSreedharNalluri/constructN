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
      date = "Today";
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
      diffInHours > 0
        ? `${diffInHours} hours ago`
        : `${diffInMinutes} minutes ago`;
    return formattedTimeDifference;
  };
  return (
    <React.Fragment>
      <div>
        <div className="p-2">
          {Object.keys(notifications).length > 0 &&
            Object.keys(notifications).map((date: any) => (
              <div key={date} className="border">
                <h3 className="text-lg font-bold ml-2 mt-1 p-2">{date}</h3>
                <ul>
                  {notifications[date].map(
                    (notificationObj: IUserNotification) => {
                      return (
                        <div key={notificationObj.id}>
                          <div>
                            {notificationObj?.readAt ? (
                              <div className="m-0 border-b flex justify-between border-black  h-11/12  mt-3 text-center  bg-gray-100 text-base">
                                <div className="ml-1">
                                  {notificationObj.message}
                                </div>
                                {date === "Today" ? (
                                  <div className="mr-2"></div>
                                ) : (
                                  <div className="mr-2">
                                    {Moment(notificationObj?.createdAt).format(
                                      "hh:mm A"
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div
                                className="border-b flex justify-between border-black  h-11/12 w-full mt-3   text-center  bg-white text-base"
                                onClick={() => {
                                  updateNotifications(notificationObj.id);
                                }}
                              >
                                <div className="ml-1 p-2">
                                  {notificationObj.message}
                                </div>
                                {date === "Today" ? (
                                  <div className="mr-2">
                                    {getNotifiCationTime(
                                      notificationObj?.createdAt
                                    )}
                                  </div>
                                ) : (
                                  <div className="mr-2">
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
