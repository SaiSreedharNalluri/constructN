import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { resetPasswordInit } from "../../services/userAuth";
import CheckingEmail from "../../components/container/checkingEmail";
import { CustomToast } from "../../components/divami_components/custom-toaster/CustomToast"
const Index: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const handleEmail = (formValue: any) => {
    setMessage("");
    setLoading(true);
    formValue.email = formValue.email.toLocaleLowerCase();
    resetPasswordInit(formValue)
      .then((response) => {
        if (response.success === true) {
          CustomToast("Redirecting ... ","info");
          setTimeout(() => {
            CustomToast("Please check your e-mail to reset password","info");
            // router.push(`/reset-password/${response.token}`);
            // router.push('/login');
            router.push("/login");
          }, 5000);
        }
      })
      .catch((error) => {
        if (error?.response?.status === 409) {
          CustomToast(error.response.data.message,"error");
        }
      });
  };
  return (
    <CheckingEmail
      handleEmail={handleEmail}
      message={message}
      loading={loading}
    ></CheckingEmail>
  );
};

export default Index;
