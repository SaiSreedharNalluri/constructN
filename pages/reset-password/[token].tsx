// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import NextImage from "../../components/core/Image";
// import { resetPasswordToken } from "../../services/userAuth";
// import ResetPassword from "../../components/container/resetPassword";

// const ResetPasswords: React.FC = () => {
//   const router = useRouter();
//   const [checkResponse, setCheckResponse] = useState<any>(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [message, setMessage] = useState<string>("");
//   const handleResetPassword = (formPassword: any) => {
//     setMessage("");
//     setLoading(true);
//     resetPasswordToken(
//       router.query.token as string,
//       formPassword.password as string
//     )
//       .then((response) => {
//         if (response.success === true) {
//           toast.info("Redirecting ... ");
//           setTimeout(() => {
//             toast.info(" reset password completed");
//             // router.push('/login');
//             router.push("/signin");
//           }, 5000);
//         }
//       })
//       .catch((error) => {
//         if (error.success === false) {
//           toast.error(error.message);
//           setCheckResponse(error.success);
//         }
//       });
//   };
//   return (
//     <ResetPassword
//       message={message}
//       loading={loading}
//       handleResetPassword={handleResetPassword}
//     ></ResetPassword>
//   );
// };
// export default ResetPasswords;

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
      console.log("routerquery", router);
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
