import React, { useEffect, useState } from 'react';
import Loginpage from '../components/container/loginpage';
import { login } from '../services/userAuth';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import Modal from 'react-responsive-modal';
const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const userObj: any = getCookie('user');
    let user = null;
    if (router.isReady) {
      if (userObj) user = JSON.parse(userObj);
      if (user && user.token) {
        if (router.query.sessionExpired === undefined) router.push('/projects');
      }
    }
  }, [router.isReady]);
  const handlerLogin = (formValue: { email: string; password: string }) => {
    const { email, password } = formValue;
    setMessage('');
    setLoading(true);
    login(email, password).then(
      (response) => {
        if (response.success === true) {
          if (response?.result?.verified === true) {
            toast.success('user logged in sucessfully');
            router.push('/projects');
          } else {
            setOpen(true);
            return;
          }
        }
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };
  return (
    <React.Fragment>
      <Loginpage
        message={message}
        loading={loading}
        handleLogin={handlerLogin}
        buttonName={''}
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
        </div>
      </Modal>
    </React.Fragment>
  );
};
export default Login;
