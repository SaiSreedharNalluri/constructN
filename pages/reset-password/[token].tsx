import React, { useEffect, useState } from "react";
import ResetPassword from "../../components/divami_components/reset-password/ResetPassword";
import { useRouter } from "next/router";
import { CustomToast } from "../../components/divami_components/custom-toaster/CustomToast";
import { validatePasswordToken } from "../../services/userAuth";
import TokenNotVerify from "../../components/divami_components/reset-password/verificationLinkExpired/TokenNotVerifyFailed";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [checkPage, setCheckPage] = useState<boolean>(false);
  useEffect(() => {
    if (router.isReady) {
    validatePasswordToken(router.query.token as string)
        .then((response) => {
          if (response.success === true) {
            CustomToast(response.message,"success");
            setCheckPage(true);
           }
        })
        .catch((error) => {
          CustomToast(error.message,"error");
        });
    }
  }, [router]);
  return (
    <div>
     {checkPage ?
      ( <ResetPassword />):(<div><TokenNotVerify/></div>)}
    </div>
  );
};

export default ResetPasswordPage;
