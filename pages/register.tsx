import { useRouter } from 'next/router';
import React, { useState } from 'react';
import RegisterPage from '../components/container/registerPage';
import { registerUser } from '../services/userAuth';

const Register: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const handleRegister = (formValue: any) => {
    delete formValue.confirmPassword;
    setMessage('');
    setLoading(true);
    registerUser(formValue)
      .then((response) => {
        if (response.success === true) {
          router.push('/login');
        }
      })
      .catch();
  };
  return (
    <React.Fragment>
      <RegisterPage
        handleRegister={handleRegister}
        message={message}
        loading={loading}
      />
    </React.Fragment>
  );
};
export default Register;
