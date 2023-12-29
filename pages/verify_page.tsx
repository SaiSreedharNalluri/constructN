import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import VerifyUser from "../components/divami_components/verify-user/VerifyUser";
interface QueryParams {
  email: string;
}
const VerifyPage = () => {
  const router = useRouter();
  const [queryMail, setQueryMail] = useState<any>("");

  useEffect(() => {
    setQueryMail(router.query.email);
  }, [router.query.email]);

  return (
    <div>
      <VerifyUser queryMail={queryMail} />
    </div>
  );
};

export default VerifyPage;
