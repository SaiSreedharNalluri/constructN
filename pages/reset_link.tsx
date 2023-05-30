import React, { useState, useEffect } from "react";

import ResetLink from "../components/divami_components/reset-link-sent/ResetLink";
import { useRouter } from "next/router";

const ResetPage = () => {
  const router = useRouter();
  const [queryMail, setQueryMail] = useState<any>("");
  console.log("query", router.query);

  useEffect(() => {
    setQueryMail(router.query.email);
  }, [router.query.email]);

  return (
    <div>
      <ResetLink queryMail={queryMail} />
    </div>
  );
};

export default ResetPage;
