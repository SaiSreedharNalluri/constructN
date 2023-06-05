import React, { useEffect, useState } from "react";
import { IProjects } from "../../models/IProjects";
import Moment from "moment";
import { useRouter } from "next/router";
import NextImage from "../core/Image";
import { Mixpanel } from "../analytics/mixpanel";
interface IProps {
  projects: IProjects[];
  loading: boolean;
}
let ProjectsList: React.FC<IProps> = ({ projects, loading }) => {
  const router = useRouter();
  Mixpanel.track("projects_list_page_open");
  return (
    <div className=" calc-h overflow-y-auto overflow-x-hidden grid  lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 p-2 ">
      {loading ? (
        projects.length > 0 ? (
          projects.map((pData) => {
            return (
              <div key={pData._id}>
                <div className="m-auto  border p-2 border-gray-900 border-solid h-11/12 w-11/12 mt-6 rounded-2xl  text-center  bg-white">
                  <div
                    onClick={() => {
                      window.localStorage.setItem("nodeData", "");
                      window.localStorage.setItem("expandedNodes", "");
                      Mixpanel.track("projects_list_page_close");
                      router.push(`projects/${pData._id}/structure`);
                    }}
                  >
                    <img
                      className="h-7 mt-8 cursor-pointer w-95 m-auto hover:border border-gray-500 border-solid object-contain"
                      src={
                        pData.coverPhoto
                          ? pData.coverPhoto
                          : `${process.env.NEXT_PUBLIC_CONSTRUCTN_ATTACHMENTS_S3}/defaults/projectCoverPhoto.webp`
                      }
                    />
                  </div>
                  <div>
                    <div className="font-bold mt-4">
                      <p className="h-4">{pData.name}</p>
                    </div>
                    <p className="mt-6">last capture:</p>
                    {pData.LastUpdatedOn ? (
                      <h4 className="mt-2">
                        {Moment(pData.LastUpdatedOn).format("MMM Do YYYY")}
                      </h4>
                    ) : (
                      <div className="mt-2">
                        <p> N/A</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className=" absolute  top-1/2 bg-opacity-50 left-1/3 rounded p-2  bg-gray-300 text-orange-400 ">
            <h1> There is no project assigned to this user</h1>
          </div>
        )
      ) : (
        <div className="flex justify-center items-center h-screen w-screen">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectsList;
