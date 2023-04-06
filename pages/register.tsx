import { useRouter } from 'next/router';
import React, { useState } from 'react';
import RegisterPage from '../components/container/registerPage';
import { registerUser } from '../services/userAuth';
import { toast } from 'react-toastify';

const Register: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const handleRegister = (formValue: any) => {
    delete formValue.confirmPassword;
    formValue.email = formValue.email.toLocaleLowerCase();
    setLoading(true);
    registerUser(formValue)
      .then((response) => {
        if (response.success === true) {
          toast.success('User Registeration completed in sucessfully');
          toast.info('Redirecting ... ');

          setTimeout(() => {
            toast.info('Please check your e-mail to verify the account');
            router.push('/login');
          }, 5000);
        }
      })
      .catch((error) => {
        if (error?.response?.status === 409) {
          toast.error(error.response.data.message);
        }
      });
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
