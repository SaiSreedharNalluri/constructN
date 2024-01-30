import Image from "next/image";
import editIcon from "../../../../public/divami_icons/edit.svg";
import React, { useEffect, useState } from "react";
import { getProjectsList } from "../../../../services/project";
import router from "next/router";
import Moment from "moment";
import task from "../../../../public/divami_icons/fileTextIcon.svg";
import CustomDrawer from "../../custom-drawer/custom-drawer";
import ChangePassword from "../ChangePassword";
import EditUserProfile from "../editUserProfile";
import { AWS } from "../../../../config/config";
import { Mixpanel } from "../../../analytics/mixpanel";

const Body = ({
  userDetails,
  updateProfileInfo,
  isUserProfileDrawerOpen,
  setIsUserProfileDrawerOpen,
  handleImageUPload,
}: any) => {
  const [projectDetails, setProjectDetails] = useState<any>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      // getProjectsList().then((response) => {
      //   if (response.status === 200) {
      //     setProjectDetails(response.data.result);
      //   }
      // });
    }
  }, []);
  
  const handlePasswordChange = () => {
    setIsDrawerOpen(true);
    Mixpanel.track( {name: "change_password_clicked",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"profile",event_action:"change_password_clicked",user_id:userDetails._id}) 
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  const handleEditUserProfile = () => {
    setIsUserProfileDrawerOpen(true);
  };
  const closeEditProfile = () => {
    setIsUserProfileDrawerOpen(false);
  };
  return (userDetails&&
    <div className="px-3 calc-h119 overflow-y-auto">
      <div className="mt-4 ">
      <div className="flex relative rounded-full flex-col items-center justify-center py-4">
        <div className="rounded-full">
        <Image
                src={
                  userDetails?.avatar
                    ? userDetails?.avatar
                    : `${AWS.CDN_ATTACHMENTS}/defaults/user_icon_def_01.png`
                }
                alt=""
                width={75}
                height={75}
                className="rounded-full h-[75px] border border-gray-500"
              />
        </div>
           
              <div className="relative bg-[#F1742E] rounded-full bottom-4 left-4">
                <Image
                  src={editIcon}
                  onClick={handleEditUserProfile}
                  alt=""
                  width={25}
                  height={25}
                  className="p-1 cursor-pointer "
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
              <p className="text-lg font-semibold text-[#101F4C]">
                {userDetails?.firstName + " " + userDetails?.lastName}
              </p>
              <div>{userDetails?.email}</div>
            </div>
        <div className="flex justify-between px-4 ">
        <div className=" pl-4">
                    <p className="text-[#101F4C] text-base font-medium">
                      {userDetails?.firstName}
                    </p>
                    <label className="  text-sm text-[#787878]">
                      First Name
                    </label>
                  </div>
                  <div className=" mr-[24px] ">
                    <p className="text-[#101F4C] text-base font-medium">{userDetails?.lastName}</p>
                    <label className=" text-sm text-[#787878]">Last Name</label>
                  </div>
            
        </div>
      </div>
      <div>
        {/* <h3 className="py-2">Project Assigned</h3>

        <div className="grid grid-cols-2  gap-2 h-full w-full">
          {projectDetails?.map((pData: any) => {
            return (
              <div key={pData._id}>
                <div className="my-1 mx-1 border h-full  border-gray-100 shadow-md border-solid rounded  bg-white">
                  <img
                    className="h-7 mt-2 cursor-pointer w-11/12  object-contain"
                    src={
                      pData.coverPhoto
                        ? pData.coverPhoto
                        : `${AWS.CDN_ATTACHMENTS}/defaults/projectCoverPhoto.webp`
                    }
                    alt=""
                  />
                  <div>
                    <div className=" px-2 py-1 ">
                      <p className="text-sm overflow-hidden h-[36px] font-semibold  text-center" style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
                        {pData.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm px-2 py-0.5 text-center"> {pData?.role}</p>
                    </div>
                    <div>
                      <p className="text-sm px-2 py-0.5  ">
                        Member Since {" "}
                      <span className="text-sm text-[#F1742E]">{Moment(pData?.createdAt)
                          .subtract(10, "days")
                          .calendar()} </span>  
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div> */}
        <div className="py-4 flex fixed bottom-0  px-4">
          <Image src={task} alt=""></Image>
          <p className="text-[#101F4C]">
            <span
              className="text-[#F1742E] cursor-pointer ml-1"
              onClick={handlePasswordChange}
            >
              {" "}
              Click here
            </span>{" "}
            to change password
          </p>
        </div>
      </div>

      {isDrawerOpen && (
        <CustomDrawer onClose={closeDrawer}>
    { Mixpanel.track( {name: "change_password_page_loaded",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"change_password",event_action:"change_password_page_loaded",user_id:userDetails._id})}
          <ChangePassword closeDrawer={closeDrawer} userDetails={userDetails}>         
      </ChangePassword>
        </CustomDrawer>
      )}
      {isUserProfileDrawerOpen && (
        <CustomDrawer>
           <div  className="h-full">
           <EditUserProfile
            userDetails={userDetails}
            closeEditProfile={closeEditProfile}
            updateProfileInfo={updateProfileInfo}
            handleImageUPload={handleImageUPload}
          ></EditUserProfile>
           </div>
        
        </CustomDrawer>
      )}
    </div>
  );
};
export default Body;
