import React, { useContext, useEffect, useState } from "react";
import Loginpage from "../components/container/loginpage";
import { login, ResendEmailVerificationLink } from "../services/userAuth";
import { useRouter } from "next/router";
import { deleteCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { Mixpanel } from "../components/analytics/mixpanel";
import Modal from "react-responsive-modal";
const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  Mixpanel.track("login_page_open");

  useEffect(() => {
    const userObj: any = getCookie("user");
    let user = null;
    if (router.isReady) {
      if (userObj) user = JSON.parse(userObj);
      if (user && user.token) {
        if (router.query.sessionExpired === undefined) {
          // router.push("/projects");
        } else {
          deleteCookie("user");
        }
      }
    }
  }, [router, router.isReady]);
  const handlerLogin = (formValue: { email: string; password: string }) => {
    const { email, password } = formValue;
    setMessage("");
    setLoading(true);
    login(email?.toLocaleLowerCase(), password)
      .then((response: any) => {
        if (response.success === true) {
          if (response?.result?.verified === true) {
            localStorage.setItem("userInfo", response.result?.fullName);
            toast.success("user logged in sucessfully");
            Mixpanel.identify(email);
            Mixpanel.track("login_success", {
              email: email,
            });
            Mixpanel.track("login_page_close");
            router.push("/projects");
          } else {
            setOpen(true);
            setToken(response.result.token);
            return;
          }
        }
      })
      .catch((error: any) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        Mixpanel.track("login_fail", {
          email: email,
        });

        setLoading(false);
        setMessage(resMessage);
      });
  };
  const resendEmail = () => {
    ResendEmailVerificationLink(token)
      .then((response) => {
        if (response.success === true) {
          setOpen(false);
          toast.success(response.message);
          setTimeout(() => {
            router.reload();
          }, 3000);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <React.Fragment>
      <Loginpage
        message={message}
        loading={loading}
        handleLogin={handlerLogin}
        buttonName={""}
      />
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          router.reload();
        }}
      >
        <h1 className=" font-bold">Your is Email Not Verified</h1>
        <p className="mt-2">
          Your email is not verified. please check your mail and try to verify
          it.
        </p>
        <div className="grid grid-cols-2 gap-x-4 mt-4">
          <button
            onClick={() => {
              setOpen(false);
              router.reload();
            }}
            className="px-2 py-1  focus:outline-none bg-gray-500 hover:bg-gray-800 rounded text-gray-200 font-semibold"
          >
            OK
          </button>
          <button
            onClick={resendEmail}
            className="px-2 py-1  focus:outline-none bg-gray-500 hover:bg-gray-800 rounded text-gray-200 font-semibold"
          >
            Resend Email
          </button>
        </div>
      </Modal>
    </React.Fragment>
  );
};
export default Login;
