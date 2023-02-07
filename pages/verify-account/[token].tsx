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
          className="h-screen w-screen" />
        <div className=" absolute  top-1/2 bg-opacity-50 left-1/3 rounded p-2  bg-gray-300 ">
          <div className='flex'>
            <div>
              <p>Failed to verify user. Invalid token</p>
            </div>
            <div className="mt-1 ml-2">
              <svg className="spinner" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" ></circle>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </React.Fragment>
  );
};
export default VerifyEmail;
