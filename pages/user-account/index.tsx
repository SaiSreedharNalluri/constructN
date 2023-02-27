import { useRouter } from 'next/router'
import React, { useEffect, useState, useRef } from 'react'
import Header from '../../components/container/header'
import { getUserProfile, updateProfileAvatar, updateUserProfile } from '../../services/userAuth'
import Image from 'next/image';
import moment from 'moment'
import { toast } from 'react-toastify'

interface IProps {
    handleImageUPload: (e: object) => void;
}
const Index: React.FC = () => {
    const router = useRouter();
    const [userDetails, setUserDetails] = useState<any>();
    const [firstname, setFirstname] = useState<any>();
    const [lastname, setLastname] = useState<any>();
    const [email, setEmail] = useState<any>();
    const [dob, setDob] = useState<any>();
    const [uploadImage, setUploadImage] = useState<any>();
    const [selectedFile, setSelectedFile] = useState<any>()
    const [preview, setPreview] = useState<any>()
    const inputRef: any = useRef();
    const onSelectFile = (e: any) => {
        e.preventDefault();
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
        }
        setSelectedFile(e.target.files[0]);
        setUploadImage(uploadImage);
    }
    const handleUploadClick = (e: any) => {
        if (!selectedFile) {
            return;
        }
        var newBlob = new Blob([selectedFile], { type: 'image/png' });
        // const objectUrl = URL.createObjectURL(selectedFile);
        // console.log("obj url", objectUrl);
        var fd = new FormData();
        console.log("newblob", newBlob);
        fd.append("file", newBlob, "avatar.png");
        setPreview(newBlob);
        updateProfileAvatar(fd).then(res => {
            if (res.success === true) {
                setUploadImage(res?.result.avatar)
            }
        })
    }
    useEffect(() => {
        if (router.isReady) {
            getUserProfile().then(response => {
                if (response.success === true) {
                    setUserDetails(response.result)
                    setFirstname(response?.result.firstName)
                    setLastname(response?.result.lastName)
                    setEmail(response?.result.email)
                    setDob(response?.result.dob);
                    setUploadImage(response?.result.avatar)
                }
            })
        }
    }, [router.isReady])

    let handleSubmit = (e: any) => {
        e.preventDefault();
        updateUserProfile(firstname, lastname, email, dob, uploadImage)
            .then((response) => {
                if (response?.success === true) {
                    setFirstname(response?.result.firstName)
                    setLastname(response?.result.lastName)
                    setEmail(response?.result.email)
                    setDob(response?.result.dob)
                    setUploadImage(response?.result.avatar)
                }
            })
            .catch((error) => {
                if (error.success === false) {
                    toast.error(error?.message);
                }
            });
    }
    return (
        <div>
            <div>
                <Header></Header>
            </div>
            <div>
                <div className='calc-h overflow-y-auto'>
                    <div >
                        <div className='px-10'>
                            <div>
                                <h1 className='font-semibold text-xl'>User Information</h1>
                            </div>
                            <div className="flex mt-4">
                                <div className='w-36 4 h-36  rounded-full overflow-hidden  border border-solid border-gray-900'>
                                    <Image onClick={() => inputRef.current.click()} src={userDetails?.avatar} alt="" width={720} height={720} className="  w-full h-full cursor-pointer " />
                                </div>
                                <div className='flex flex-col justify-center '>
                                    <button className='py-2    min-w-full bg-blue-600 hover:bg-blue-800  ml-2 rounded text-gray-200 font-semibold' onClick={handleUploadClick}>Upload</button>
                                    <input type='file' ref={inputRef} className='hidden ml-2 py-2' onChange={onSelectFile} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='px-10 py-4'>
                        <h1 className='font-semibold text-xl text-gray-400'>Personal Details</h1>
                    </div>
                    <div >
                        <form onSubmit={handleSubmit}>
                            <div className='grid grid-cols-1'>
                                <div className=' gap-10 px-10 py-2'>
                                    <label htmlFor="" className='inputImp'>Firstname</label>
                                    <input required value={firstname} onChange={(e) => setFirstname(e.target.value)} className=' w-full border border-gray-600 focus:outline-none  text-sm   no-underline   rounded  p-2'></input>
                                </div>
                                <div className='gap-10 px-10 py-2'>
                                    <label htmlFor="" className='inputImp'>Lastname</label>
                                    <input value={lastname} onChange={(e) => setLastname(e.target.value)} className='border border-gray-600 focus:outline-none  text-sm  w-full rounded  p-2'></input>
                                </div>
                                <div className=' gap-10 px-10  py-2'>
                                    <label htmlFor="" className=''>Email</label>
                                    <input value={email} className='border cursor-not-allowed  border-gray-600 focus:outline-none  text-sm  w-full rounded  p-2'></input>
                                </div>
                                <div className=' gap-10 px-10 py-2'>
                                    <label htmlFor="" >Dob</label>
                                    <input type="date" value={moment(dob).format('YYYY-MM-DD')} onChange={(e) => setDob(e.target.value)} className='border  border-gray-600 focus:outline-none p-2 text-sm  w-full rounded  '></input>
                                </div>

                            </div>
                            <div className='flex  justify-center '>
                                <button className='px-2 py-1 mt-2 bg-red-500 hover:bg-red-800  rounded text-gray-200 font-semibold '>Submit</button>
                            </div>
                        </form>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Index

