import { useRouter } from "next/router";
import React, { useState } from "react";
import RegisterPage from "../components/container/registerPage";
import { registerUser } from "../services/userAuth";
import { CustomToast } from "../components/divami_components/custom-toaster/CustomToast";


const Register: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }
  const handleRegister = (
    formValue: FormValues,
    {
      resetForm,
    }: {
      resetForm: (nextValues?: Partial<FormValues>) => void;
    }
  ) => {
    delete formValue.confirmPassword;
    formValue.email = formValue.email.toLocaleLowerCase();
    setLoading(true);
    registerUser(formValue)
      .then((response) => {
        if (response.success === true) {
          CustomToast("User Registeration completed sucessfully","success");
          CustomToast("Redirecting ... ","info");

          setTimeout(() => {
            CustomToast("Please check your e-mail to verify the account","info");
            // router.push('/login');
            router.push("/login");
          }, 5000);
        }
      })
      .catch((error) => {
        if (error?.response?.status === 409) {
          CustomToast(error.response.data.message,"error");
        }
        resetForm();
        setLoading(false);
      });
  };
  return (
    <React.Fragment>
      <RegisterPage handleRegister={handleRegister} loading={loading} />
    </React.Fragment>
  );
};
export default Register;
