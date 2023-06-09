import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NextImage from "../../components/core/Image";
import { ResendEmailVerification, verifyEmail } from "../../services/userAuth";
import AccountVerify from "../../components/divami_components/account_page/AccountVerify";
import AccountNotVerify from "../../components/divami_components/account_message/AccountNotVerify";

const VerifyUserEmail = () => {
  const router = useRouter();
  const [checkResponse, setCheckResponse] = useState<any>();
  const [checkPage, setCheckPage] = useState<boolean>(false);
  const [uniqueToken, setUniqueToken] = useState<any>("");
  useEffect(() => {
    if (router.isReady) {
      setUniqueToken(router.query.token);
      //   return;
      verifyEmail(router.query.token as string)
        .then((response) => {
          if (response.success === true) {
            toast.success(response.message);
            // toast.info("Redirecting ... ");
            setCheckPage(true);
            setTimeout(() => {
              // router.push('/login');
              // router.push("/login");
              router.push("/account_success");
            }, 5000);
          }
        })
        .catch((error) => {
          toast.error(error.message);
          setCheckResponse(error);
        });
    }
  }, [router]);
  return (
    <>
      {checkPage ? (
        <AccountVerify />
      ) : (
        <AccountNotVerify uniqueToken={uniqueToken} />
      )}
    </>
  );
};

export default VerifyUserEmail;
