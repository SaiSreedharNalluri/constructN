import React, { useState } from 'react';
import * as Yup from "yup";
import { Formik, Form, ErrorMessage } from 'formik';
import SubmitButton from './core/buttons/submitButton';
import InputPassword from './core/Input/inputPassword';
import showPasswordImage from "../public/icons/show-password.svg";
import hidePasswordImage from "../public/icons/hide-password.svg";
import NextImage from '../components/core/Image';
import Image from 'next/image';
import router from 'next/router';
import OkButton from './core/buttons/okButton';
interface IProps {
    message: string;
    loading: boolean;
    handleResetPassword: (e: object) => void;
}
const ResetPassword: React.FC<IProps> = ({ loading, message, handleResetPassword }) => {
    const initialValues: {
        password: string;
        confirmPassword: string;
    } = {
        password: '',
        confirmPassword: '',
    };
    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required('Password is required')
            .min(5, 'Minimum 5 characters required'),
        confirmPassword: Yup.string()
            .required('Confirm password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    });
    const [isRevealPwd, setIsRevealPwd] = useState(false);
    const [isCRevealPwd, setIsCRevealPwd] = useState(false);
    const [active, setActive] = useState('');
    return (
        <div>
            <div className=" w-full  ">
                <NextImage
                    src="https://constructn-attachments.s3.ap-south-1.amazonaws.com/Login/login02.png"
                    className="h-screen w-screen"
                />

                <div className=" absolute w-3/4 top-0 bg-opacity-50 px-5 h-full 2xl:w-1/4 xl:w-1/3 lg:w-1/4 md:w-1/2 sm:w-1/2 right-0   place-items-center bg-gray-300 ">
                    <div className="grid grid-cols-1 gap-4 border my-48   border-solid place-content-center border-gray-500 rounded-3xl ">
                        <h2 className="text-center text-xl font-bold">Reset Password</h2>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleResetPassword}
                        >
                            <Form className=" grid grid-cols-1 gap-y-2 px-4">
                                <div className="relative">
                                    <InputPassword
                                        name="password"
                                        type={isRevealPwd}
                                        placeholderName="Password"
                                    />
                                    <div className="absolute p-3 inset-y-0 right-0">
                                        <Image
                                            alt=""
                                            title={isRevealPwd ? 'Hide password' : 'Show password'}
                                            src={isRevealPwd ? hidePasswordImage : showPasswordImage}
                                            onClick={() => setIsRevealPwd((prevState) => !prevState)}
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="alert alert-danger"
                                    />
                                </div>

                                <div className="relative">
                                    <InputPassword
                                        name="confirmPassword"
                                        type={isCRevealPwd}
                                        placeholderName="Confirm Password"
                                    />
                                    <div
                                        className={`${active === 'confirm password'
                                            } absolute p-3 inset-y-0 right-0`}
                                        id="confirm password"
                                    >
                                        <Image
                                            alt=""
                                            title={isCRevealPwd ? 'Hide password' : 'Show password'}
                                            src={isCRevealPwd ? hidePasswordImage : showPasswordImage}
                                            onClick={() => setIsCRevealPwd((prevState) => !prevState)}
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="div"
                                        className="alert alert-danger"
                                    />
                                </div>
                                <div className="py-2 grid grid-cols-1 gap-2">
                                    <SubmitButton buttonName="Confirm" disabled={loading} />
                                    <OkButton
                                        buttonName="Go login page"
                                        disabled={false}
                                        clickTheOkButton={() => {
                                            router.push('/login');
                                        }}
                                    />
                                </div>
                                {message && (
                                    <div className="form-group">
                                        <div className="alert alert-danger" role="alert">
                                            {message}
                                        </div>
                                    </div>
                                )}
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword