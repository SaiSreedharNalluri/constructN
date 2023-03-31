import React, { useEffect, useState } from 'react';
import Loginpage from '../components/container/loginpage';
import { login } from '../services/userAuth';
import { Router, useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import mixpanel from 'mixpanel-browser';
const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  mixpanel.time_event('page_viewed')

  useEffect(() => {
    const userObj: any = getCookie('user');
    let user = null;
    if(router.isReady){
    if (userObj) user = JSON.parse(userObj);
    if (user && user.token) {
      //console.log(router.query.sessionExpired,"TEST")
      if(router.query.sessionExpired===undefined)
      router.push('/projects');
    }
  }
  },[router.isReady]);
  const handlerLogin = (formValue: { email: string; password: string }) => {
    const { email, password } = formValue;
    setMessage('');
    setLoading(true);
    login(email, password).then(
      (response) => {
        if (response.success === true) {
          toast.success('user logged in sucessfully');
          mixpanel.identify(email)
          mixpanel.track('Login', {
            'email': email,
          });
          mixpanel.time_event('page_exit')
          router.push('/projects');
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
    </React.Fragment>
  );
};
export default Login;
