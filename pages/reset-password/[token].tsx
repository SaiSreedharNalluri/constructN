import React, { useEffect, useState } from "react";
import ResetPassword from "../../components/divami_components/reset-password/ResetPassword";
import { useRouter } from "next/router";
import { CustomToast } from "../../components/divami_components/custom-toaster/CustomToast";
import { validatePasswordToken } from "../../services/userAuth";
import TokenNotVerify from "../../components/divami_components/reset-password/verificationLinkExpired/TokenNotVerifyFailed";
import CustomLoader from "../../components/divami_components/custom_loader/CustomLoader";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [checkPage, setCheckPage] = useState<boolean>(false);
  const[showLoading,setShowLoading] = useState(true)
  useEffect(() => {
    if (router.isReady) {
    validatePasswordToken(router.query.token as string)
        .then((response) => {
          if (response.success === true) {
            setCheckPage(true);
            setShowLoading(false)
           }
        })
        .catch((error) => {
          setShowLoading(false)
          CustomToast(error.message,"error");
        });
    }
  }, [router]);
  return (
    <div>
      {
      showLoading ?<CustomLoader/>:
      (<div>{checkPage ?
        ( <ResetPassword />):(<div><TokenNotVerify/></div>)}</div>)
    }
     
    </div>
  );
};

export default ResetPasswordPage;
