import React, { useEffect, useState } from 'react'
import { IProjects } from '../../models/IProjects';
import Image from "next/image";
import Moment from 'moment';
import edit from "../../public/divami_icons/edit.svg";
import deleteIcon from "../../public/divami_icons/delete.svg";
import { Map, Marker } from 'react-map-gl';
import { getCookie } from 'cookies-next';
import router from 'next/router';
import { IUser } from '../../models/IUser';
interface IProps {
    projectData: IProjects;
}
const ProjectDetails:React.FC<IProps>=({projectData})=> {
  let [user, setUser] = useState<IUser>();
    useEffect(() => {
        const userObj: any = getCookie("user");
        let user = null;
        if (userObj) user = JSON.parse(userObj);
        if (user?.fullName) {
          setUser(user);
        }
      }, []);
  const  latitude:any=
    projectData?.location != undefined ? projectData?.location[0]:0 ;
 const longitude:any=
    projectData?.location != undefined ? projectData?.location[1] :0;
  const utm= projectData?.utm ? projectData?.utm : 'NA';
  return (
    <div >
    <div className='flex justify-between px-4 py-4'>
    <div>
      <h1 className='text-[#101F4C]'>Project Details</h1>
    </div>
    <div className=' text-[#F1742E] cursor-pointer'>
      <p>Edit Details</p>
    </div>
   </div>
   {/* <div className='flex border-2 border-gray-300 mx-4 rounded-md'>
    <div className='w-1/2'>
kjmklmj
    </div>
    <div className=''></div>
    <div className='w-1/2'>
,lkrml
    </div>
   </div> */}
       <div className='grid grid-cols-2 divide-x-2 border-2 border-gray-300 mx-4 rounded-md'>
        <div className='grid grid-rows-3'>
            <div className=' border-b border-black mx-4 py-1'>
            <img
          alt=""
          className=" w-3/4 h-20"
          width={1080}
          height={1080}
          src={
            projectData?.coverPhoto
          } 
        />
<div className='flex  justify-end'><Image src={edit} alt="" className="h-4 w-4" ></Image> 
<Image src={deleteIcon} alt="" className="h-4 w-4" ></Image>
</div>
            </div>
            <div className=' border-b border-[#F1742E]'>
            <div className='grid grid-cols-3  px-6  py-4'>
                <div>
                <p className='text-[#101F4C]'>
                    {projectData?.name}</p>
                <label className='  text-sm text-[#787878]' >Project Name</label>               
                </div>
                <div>   
                <p className='text-[#101F4C]'>
                    {projectData?.type}</p>
                <label className=' text-[#787878] text-sm' >Project Type</label> </div>
                <div className='text-[#101F4C]'><p>{user?.fullName}</p>
                <label className='  text-sm text-[#787878]' >Project Owner</label></div>
            </div>
            <div className='grid grid-cols-3  px-6 '>
            <div> <p className='text-[#101F4C]'>
                     {Moment( projectData?.createdAt).format('MMM Do YYYY')}</p>
                <label className='  text-sm text-[#787878]' >Created On</label></div>
            <div>
            <p className='text-[#101F4C]'>
                    {projectData?.email}</p>
                <label className=' text-sm text-[#787878]' >Email Id</label>
            </div>
            </div>
            </div>
           
        </div>
        <div className=' grid grid-rows-3'>
       
        <div className='px-4 py-4' > 
        <div className=' '>Location</div>  
        <div className='grid grid-cols-3 py-2'>
        <div>
                    <p className='text-[#101F4C]'>{utm}</p>
                     <label className='text-[#787878]  text-sm' >UTM</label>
                    </div>
                    <div>
                    <p className='text-[#101F4C]'>{latitude}</p>
                     <label className='text-[#787878]  text-sm' >Latitude</label>
                    </div>
                    <div>
                        <p className='text-[#101F4C]'>{longitude}</p>
                     <label className=' text-[#787878]  text-sm' >Longitude</label></div>
            </div>       
                   
                </div>
             
                <div className=' grid row-span-2 border-2 border-[#F1742E]'>
                <Map
                 latitude={latitude}
                 longitude={longitude}
                 zoom={10}
                 mapStyle="mapbox://styles/mapbox/streets-v9"
                  mapboxAccessToken={process.env.NEXT_PUBLIC_Map_Token}
                >
                   <Marker latitude={latitude} longitude={longitude}>
                
              </Marker>
                </Map>
                </div>
            </div>
        </div>
       </div>
   

  
  )
}

export default ProjectDetails










