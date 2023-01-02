import React, { useState } from 'react';
import Loginpage from '../components/container/loginpage';
import { login } from '../services/userAuth';
import { useRouter } from 'next/router';
const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const handlerLogin = (formValue: { email: string; password: string }) => {
    const { email, password } = formValue;
    setMessage('');
    setLoading(true);
    login(email, password).then(
      (response) => {
        if (response.success === true) {
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
