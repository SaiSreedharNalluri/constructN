import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import NextImage from '../../components/core/Image';
import { verifyEmail } from '../../services/userAuth';

const VerifyEmail: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      verifyEmail(router.query.token as string)
        .then((response) => {
          if (response.success === true) {
            toast.success(response.message);
            toast.info('Redirecting ... ');
            setTimeout(() => {
              router.push('/login');
            }, 5000);
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  }, [router]);
  return (
    <React.Fragment>
      <div className=" w-full  ">
        <NextImage
          src="https://constructn-attachments.s3.ap-south-1.amazonaws.com/Login/login02.png"
          className="h-screen w-screen"
        />
      </div>
    </React.Fragment>
  );
};
export default VerifyEmail;
