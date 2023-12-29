import React from "react";
import { toast } from "react-toastify";

export const CustomToast = (message: string, type: string, timer?: number | false) => {
  switch (type) {
    case "success":
      return toast.success(message, {
        autoClose: timer != undefined ? timer : 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    case "error":
      return toast.error(message, {
        autoClose: timer != undefined ? timer : 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    default:
      return toast(message, {
        autoClose: timer != undefined ? timer : 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
  }
};
