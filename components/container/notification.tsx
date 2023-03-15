import React, { useEffect, useState } from 'react';
import { getAllUserNotifications } from '../../services/notifications';
const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState();
  useEffect(() => {
    getAllUserNotifications()
      .then((response) => {})
      .catch((error) => {});
  }, []);
  return (
    <React.Fragment>
      <h1>Notification</h1>
    </React.Fragment>
  );
};
export default Notification;
