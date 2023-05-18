import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NextImage from "../../components/core/Image";
import { ResendEmailVerification, verifyEmail } from "../../services/userAuth";
const VerifyEmail: React.FC = () => {
  const router = useRouter();
  const [checkResponse, setCheckResponse] = useState<any>();
  useEffect(() => {
    if (router.isReady) {
      verifyEmail(router.query.token as string)
        .then((response) => {
          if (response.success === true) {
            toast.success(response.message);
            toast.info("Redirecting ... ");
            setTimeout(() => {
              // router.push('/login');
              router.push("/signin");
            }, 5000);
          }
        })
        .catch((error) => {
          toast.error(error.message);
          setCheckResponse(error);
        });
    }
  }, [router]);
  const resendEmail = () => {
    ResendEmailVerification(router.query.token as string)
      .then((response) => {
        if (response.success === true) {
          toast.success(response.message);
          toast.info("Redirecting ... ");
          setTimeout(() => {
            // router.push("/login");
            router.push("/signin");
          }, 5000);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        setCheckResponse(error);
      });
  };
  return (
    <React.Fragment>
      <div className=" w-full  ">
        <NextImage
          src="https://constructn-attachments.s3.ap-south-1.amazonaws.com/Login/login02.png"
          className="h-screen w-screen"
        />
        <div className=" absolute  top-1/2 bg-opacity-50 left-1/3 rounded p-2  bg-gray-300 ">
          <div>
            <div>
              {checkResponse?.success === false ? (
                <div>
                  <p className="text-orange-400">{checkResponse.message}</p>
                  {checkResponse.userVerificationToken === "expired" && (
                    <div>
                      <button
                        onClick={resendEmail}
                        className="mt-2 p-2 px-2 py-1  focus:outline-none bg-gray-500 hover:bg-gray-800 rounded text-gray-200 font-semibold"
                      >
                        Resend Email
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default VerifyEmail;
