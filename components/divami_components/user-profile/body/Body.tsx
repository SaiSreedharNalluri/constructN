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
      getProjectsList().then((response) => {
        if (response.status === 200) {
          setProjectDetails(response.data.result);
        }
      });
    }
  }, []);
  console.log(projectDetails,"pr");
  
  const handlePasswordChange = () => {
    setIsDrawerOpen(true);
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
      <div className="flex mt-4 ">
        <div className="relative rounded-full ">
          <Image
            src={
              userDetails?.avatar
                ? userDetails?.avatar
                : `${process.env.NEXT_PUBLIC_CONSTRUCTN_ATTACHMENTS_S3}/defaults/user_icon_def_01.png`
            }
            alt=""
            width={50}
            height={50}
            className="rounded-full border border-gray-500 "
          />
          <div className="absolute bottom-0 right-0 bg-[#F1742E] rounded-full">
            <Image
              src={editIcon}
              onClick={handleEditUserProfile}
              alt=""
              width={25}
              height={25}
              className=" p-1 cursor-pointer "
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
        </div>
        <div className="flex-col ml-4">
          <div className=" text-lg text-[#101F4C] font-semibold">
            {userDetails?.firstName + " " + userDetails?.lastName}
          </div>
          <div>{userDetails?.email}</div>
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
                        : `${process.env.NEXT_PUBLIC_CONSTRUCTN_ATTACHMENTS_S3}/defaults/projectCoverPhoto.webp`
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
        <div className="py-4 flex">
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
          <ChangePassword closeDrawer={closeDrawer}></ChangePassword>
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
