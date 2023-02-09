import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import NextImage from '../../components/core/Image';
import { resetPasswordToken } from '../../services/userAuth';
import ResetPassword from '../../components/resetPassword';

const ResetPasswords: React.FC = () => {
    const router = useRouter();
    const [checkResponse, setCheckResponse] = useState<any>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const handleResetPassword = (formPassword: any) => {
        setMessage("");
        setLoading(true);
        resetPasswordToken(router.query.token as string, formPassword.password as string).then((response) => {
            if (response.success === true) {
                toast.info('Redirecting ... ');
                setTimeout(() => {
                    toast.info(' reset password completed');
                    router.push('/login');
                }, 5000);
            }
        }).catch((error) => {
            if (error.success === false) {
                toast.error(error.message);
                setCheckResponse(error.success)
            }
        });
    }
    return (
        <ResetPassword message={message} loading={loading} handleResetPassword={handleResetPassword}></ResetPassword>
    )
}
export default ResetPasswords;

