import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { resetPasswordInit } from '../../services/userAuth';
import { toast } from 'react-toastify';
import CheckingEmail from '../../components/container/checkingEmail';
const Index: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const handleEmail = (formValue: any) => {
        setMessage('');
        setLoading(true);
        resetPasswordInit(formValue)
            .then((response) => {
                if (response.success === true) {
                    toast.info('Redirecting ... ');
                    setTimeout(() => {
                        toast.info('Please check your e-mail to reset password');
                        // router.push(`/reset-password/${response.token}`);
                        router.push("/login")
                    }, 5000);
                }
            })
            .catch((error) => {
                if (error?.response?.status === 409) {
                    toast.error(error.response.data.message);
                }
            });
    };
    return (
        <CheckingEmail handleEmail={handleEmail}
            message={message}
            loading={loading}></CheckingEmail>
    )
}

export default Index