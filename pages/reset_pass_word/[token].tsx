import React, { useEffect, useState } from "react";
import ResetPassword from "../../components/divami_components/reset-password/ResetPassword";
import { useRouter } from "next/router";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [checkResponse, setCheckResponse] = useState<any>();
  const [checkPage, setCheckPage] = useState<boolean>(false);
  const [uniqueToken, setUniqueToken] = useState<any>("");

  useEffect(() => {
    if (router.isReady) {
      setUniqueToken(router.query.token);
      //   return;
    }
  }, [router]);
  return (
    <div>
      <ResetPassword uniqueToken={uniqueToken} />
    </div>
  );
};

export default ResetPasswordPage;
