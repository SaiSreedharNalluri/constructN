import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CustomToast } from "../../components/divami_components/custom-toaster/CustomToast"
import NextImage from "../../components/core/Image";
import { ResendEmailVerification, verifyEmail } from "../../services/userAuth";
import AccountVerify from "../../components/divami_components/account_page/AccountVerify";
import AccountNotVerify from "../../components/divami_components/account_message/AccountNotVerify";
import CustomLoader from "../../components/divami_components/custom_loader/CustomLoader";

const VerifyUserEmail = () => {
  const router = useRouter();
  const [checkPage, setCheckPage] = useState<boolean>(false);
  const [uniqueToken, setUniqueToken] = useState<any>("");
  const[showLoading,setShowLoading] = useState(true)
  useEffect(() => {
    if (router.isReady) {
      setUniqueToken(router.query.token);
      verifyEmail(router.query.token as string)
        .then((response) => {
          if (response.success === true) {
            CustomToast(response.message,"success");
            setCheckPage(true);
            setShowLoading(false)
            router.push("/account_success");
          }
        })
        .catch((error) => {
          setShowLoading(false)
          CustomToast(error.message,"error");
      });
    }
  }, [router]);
  return (
    <>{
      showLoading ?<CustomLoader/>:
      (<div>{checkPage ? (
        <AccountVerify />
      ) : (
        <AccountNotVerify uniqueToken={uniqueToken} />
      )}</div>)
    }
      
    </>
  );
};

export default VerifyUserEmail;
