import { IUserNotification } from "../../../../models/IUserNotification";
import Moment from "moment-timezone";
import { userNotificationTypes } from "../../../../utils/constants";
import Image from "next/image";
import all from "../../../../public/divami_icons/todoIcon.svg"
import project from "../../../../public/divami_icons/clipboardIcon.svg"
import task from "../../../../public/divami_icons/fileTextIcon.svg"
import issueIcon from "../../../../public/divami_icons/issuesIcon.svg"
import cameraIcon from "../../../../public/divami_icons/cameraIcon.svg"
import { useRef} from "react";
import { useRouter } from "next/router";
import { Mixpanel } from "../../../analytics/mixpanel";

const Body = ({
  notifications,
  loadMoreData,
  updateNotifications,getNotifiCationTime,filterNotificationData,filterValue,userId,notificationCount,setOpenNotication
}: any) => { 
  const router = useRouter(); 
  const notificationsContRef = useRef<any>(null);
  const scrollTop = () => {
    if (notificationsContRef.current) {
      notificationsContRef.current.scrollTop = 0;
    }
  };
  const performNotificationAction = (notificationObj:IUserNotification) => {
    if(notificationObj.actionType==='redirect')
    {
      generateRedirectUrl(notificationObj);
    }

  }
  const generateRedirectUrl=(notificationObj:IUserNotification)=>{
      switch(notificationObj.category)
      {
        case 'Project':
          generateProjectRedirectUrl(notificationObj)
          break;
        case 'Task':
          generateTaskRedirectUrl(notificationObj)
          break;  
        case 'Issue':
          generateIssueRedirectUrl(notificationObj)
          break;  
        case 'Issue Comment':
          generateIssueCommentRedirectUrl(notificationObj)
          break;
        case 'Task Comment':
          generateTaskCommentRedirectUrl(notificationObj)
          break;
        case 'Snapshot':
          generateSnapshotRedirectUrl(notificationObj)
          break;
        case 'Struct':
          generateStructureRedirectUrl(notificationObj)
          break; 
      }
    
  }
  const generateProjectRedirectUrl=(notificationObj:IUserNotification)=>{
    switch (notificationObj.title)
    {
      case 'Project Updated': 
          //router.push(`/projects/${notificationObj?.configuration?.project}/settings`);
          router.push({pathname:"/projects/[projectId]/settings",query:{projectId:notificationObj?.configuration?.project}})
        break;
      case 'Project User Assigned':
          //router.push(`/projects/${notificationObj?.configuration?.project}/usersList`); 
          router.push({pathname:"/projects/[projectId]/usersList",query:{projectId:notificationObj?.configuration?.project}})
        break; 
        case 'Project User Deassigned':
          //router.push(`/projects/${notificationObj?.configuration?.project}/usersList`); 
        break; 
        case 'Project User Role Changed':
          //router.push(`/projects/${notificationObj?.configuration?.project}/usersList`); 
          router.push({pathname:"/projects/[projectId]/usersList",query:{projectId:notificationObj?.configuration?.project}})
        break;    
    }
  }
  const generateIssueRedirectUrl=(notificationObj:IUserNotification)=>{
    switch (notificationObj.title)
    {
        case 'Issue Created':
          //router.push(`/projects/${notificationObj?.configuration?.project}/structure?structId=${notificationObj?.configuration?.structure}&iss=${notificationObj?.configuration?.issue}`);
          router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,iss:notificationObj?.configuration?.issue}})
          break;
        case 'Issue Modified':
          //router.push(`/projects/${notificationObj?.configuration?.project}/structure?structId=${notificationObj?.configuration?.structure}&iss=${notificationObj?.configuration?.issue}`);
          router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,iss:notificationObj?.configuration?.issue}})
          
          break;
        case 'Issue User Assigned': 
          //router.push(`/projects/${notificationObj?.configuration?.project}/structure?structId=${notificationObj?.configuration?.structure}&iss=${notificationObj?.configuration?.issue}`);
          router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,iss:notificationObj?.configuration?.issue}})
          break;
        case 'Issue User Deasigned':
          router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,iss:notificationObj?.configuration?.issue}})
          //router.push(`/projects/${notificationObj?.configuration?.project}/structure?structId=${notificationObj?.configuration?.structure}&iss=${notificationObj?.configuration?.issue}`);
          break; 
        case 'Issue Deleted':
          router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,iss:notificationObj?.configuration?.issue}})
          //router.push(`/projects/${notificationObj?.configuration?.project}/structure?structId=${notificationObj?.configuration?.structure}&iss=${notificationObj?.configuration?.issue}`);
        break; 
      }
      setOpenNotication(false)
      if(router.query.projectId === notificationObj?.configuration?.project )
      {
        setTimeout(()=>{
          router.reload()
      },300)
      }
  }
  const generateTaskRedirectUrl=(notificationObj:IUserNotification)=>{
    switch (notificationObj.title)
    {
      case 'Task Created':
        router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,tsk:notificationObj?.configuration?.task}})
        //router.push(`/projects/${notificationObj?.configuration?.project}/structure?structId=${notificationObj?.configuration?.structure}&tsk=${notificationObj?.configuration?.task}`)
        break;
      case 'Task Modified':
        router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,tsk:notificationObj?.configuration?.task}})
        //router.push(`/projects/${notificationObj?.configuration?.project}/structure?structId=${notificationObj?.configuration?.structure}&tsk=${notificationObj?.configuration?.task}`)
        break;
        case 'Task User Assigned': 
        router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,tsk:notificationObj?.configuration?.task}})
        //router.push(`/projects/${notificationObj?.configuration?.project}/structure?structId=${notificationObj?.configuration?.structure}&tsk=${notificationObj?.configuration?.task}`);
        break;
        case 'Task User Deasigned':
          router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,tsk:notificationObj?.configuration?.task}})
          //router.push(`/projects/${notificationObj?.configuration?.project}/structure?structId=${notificationObj?.configuration?.structure}&tsk=${notificationObj?.configuration?.task}`); 
        break; 
        case 'Task Deleted':
          router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,tsk:notificationObj?.configuration?.task}})
          //router.push(`/projects/${notificationObj?.configuration?.project}/structure?structId=${notificationObj?.configuration?.structure}&tsk=${notificationObj?.configuration?.task}`);
        break; 
      }
      setOpenNotication(false)
      if(router.query.projectId === notificationObj?.configuration?.project )
      {
        setTimeout(()=>{
          router.reload()
      },300)
      }
  }
  const generateStructureRedirectUrl=(notificationObj:IUserNotification)=>{
    switch (notificationObj.title)
    {
       case 'Project Struct Added':
        router.push({pathname:"/projects/[projectId]/sections",query:{projectId:notificationObj?.configuration?.project}})
        //router.push(`/projects/${notificationObj?.configuration?.project}/sections`); 
          break;
        case 'Project Struct Modified': 
        router.push({pathname:"/projects/[projectId]/sections",query:{projectId:notificationObj?.configuration?.project}})
        //router.push(`/projects/${notificationObj?.configuration?.project}/sections`);
        break;
      }
  }
  const generateSnapshotRedirectUrl=(notificationObj:IUserNotification)=>{
    switch (notificationObj.title)
    {
      case 'Snapshot Added':
        router.push({pathname:"/projects/[projectId]/sections",query:{projectId:notificationObj?.configuration?.project}})
        //router.push(`/projects/${notificationObj?.configuration?.project}/sections`); 
          break;
      case 'Snapshot Status Update':
        router.push({pathname:"/projects/[projectId]/sections",query:{projectId:notificationObj?.configuration?.project}})
          router.push(`/projects/${notificationObj?.configuration?.project}/sections`); 
            break;
      case 'Snapshot Updated': 
        router.push({pathname:"/projects/[projectId]/sections",query:{projectId:notificationObj?.configuration?.project}})
        //router.push(`/projects/${notificationObj?.configuration?.project}/sections`);
          break;
      case 'Snapshot Disabled':
          router.push({pathname:"/projects/[projectId]/sections",query:{projectId:notificationObj?.configuration?.project}})
          //router.push(`/projects/${notificationObj?.configuration?.project}/sections`); 
          break;
    }
    setOpenNotication(false)
  }
  const generateTaskCommentRedirectUrl=(notificationObj:IUserNotification)=>{
    switch (notificationObj.title)
    {
      case 'Task Comment Added':
        router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,tsk:notificationObj?.configuration?.task}})
          //router.push(`/projects/${notificationObj?.configuration?.project}/structure?structId=${notificationObj?.configuration?.structure}&tsk=${notificationObj?.configuration?.task}`);
      break;
      case 'Task Comment Updated':
        router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,tsk:notificationObj?.configuration?.task}})
          //router.push(`/projects/${notificationObj?.configuration?.project}/structure?structId=${notificationObj?.configuration?.structure}&tsk=${notificationObj?.configuration?.task}`);
      break;
    }
    setOpenNotication(false)
    if(router.query.projectId === notificationObj?.configuration?.project )
    {
      setTimeout(()=>{
        router.reload()
    },300)
    }
  }
  const generateIssueCommentRedirectUrl=(notificationObj:IUserNotification)=>{
    switch (notificationObj.title)
    {
      case 'Issue Comment Added':
        router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,iss:notificationObj?.configuration?.issue}})
        //router.push(`/projects/${notificationObj?.configuration?.project}/structure?structId=${notificationObj?.configuration?.structure}&iss=${notificationObj?.configuration?.issue}`);
        break; 
        case 'Issue Comment Updated':
          router.push({pathname:"/projects/[projectId]/structure/[structureId]/multiverseviewer",query:{projectId:notificationObj?.configuration?.project,structureId:notificationObj?.configuration?.structure,iss:notificationObj?.configuration?.issue}})
          //router.push(`/projects/${notificationObj?.configuration?.project}structure?structId=${notificationObj?.configuration?.structure}&iss=${notificationObj?.configuration?.issue}`);
        break; 
    }
    setOpenNotication(false)
    if(router.query.projectId === notificationObj?.configuration?.project )
    {
      setTimeout(()=>{
        router.reload()
    },300)
    }
  }
  return (
    <div > 
      {userNotificationTypes.map((notificationObj: any) => {
           let icon = null;
           if (filterValue ) {
             if (notificationObj.id === "All") {
               icon = (
                 <Image
                   src={all}
                   alt=""
                   width={20}
                   height={20}
                 />
               );
             } else if (notificationObj.id === "Project") {
               icon = (
                 <Image
                   src={project}
                   alt=""
                 />
               );
             } else if (notificationObj.id === "Task") {
               icon = (
                 <Image
                   src={task}
                   alt=""
                   width={20}
                   height={20}
                 />
               );
             }
             else if (notificationObj.id === "Issue") {
              icon = (
                <Image
                  src={issueIcon}
                  alt=""
                  width={20}
                  height={20}
                />
              );
            }
            else if (notificationObj.id === "Snapshot") {
              icon = (
                <Image
                  src={cameraIcon}
                  alt=""
                  width={20}
                  height={20}
                />
              );
            }
           }
     
      return (
        <button
          type="button"
          className={`${"ml-4 font-semibold  inline-block"} sticky top-0 pt-3 `}
          key={notificationObj.id}
          onClick={() => {
            filterNotificationData(notificationObj.id);
          Mixpanel.track( {name: notificationObj.name.toLowerCase()+ ""+"_tapped",project_id:"unknown",company_id:"unknown",screen_name:"projects_list_page",event_category:"notifications_actions",event_action:notificationObj.name.toLowerCase()+ ""+"_tapped",user_id:userId,notifications_count:notificationCount}) 
          }}
        >
<div className={`${
            filterValue === notificationObj.id
              ? "text-[#F1742E] py-1 border-b-2 border-[#F1742E] rounded-b-[2px]"
              : "border-gray-400 text-gray-700"
          } flex`}>
  <div> {icon}</div>
  <div className="ml-1">   {notificationObj.name}</div>
</div>

        </button>
      );
    })}
    <div className="calc-h184  overflow-y-auto" ref={notificationsContRef}>
        {Object.keys(notifications).length > 0 &&
          Object.keys(notifications).map((date: any) => (
            <div key={date} className="  ">
              <div className="flex w-full bg-gray-100">
              <h3 className="text-base  font-bold  ml-3 mt-8 mb-3">{date}</h3>
              <div className="h-0.5 flex-grow bg-gray-300 ml-3 mt-11 mx-4 "></div>
              </div>  
              <ul>
                {notifications[date].map(
                  (notificationObj: IUserNotification,index:any) => {
                     const lastChild = index === notifications[date].length - 1;
                    return (
                      <div key={notificationObj._id as string}>
                        <div className={`${lastChild ? '' : 'border-gray-400  border-b '} `}>
                        <div
                                onClick={() => {
                                updateNotifications(notificationObj._id as string);
                                performNotificationAction(notificationObj)
                              }}
                              className={`${lastChild ? '' : 'border-gray-400  border-b '}  `}
                           >
                              <div className="grid grid-cols-8 gap-4 py-4 px-4 bg-gray-100">
                                <div className="col-span-1">
                                {notificationObj.category=== "Project" ? (
                                      <Image src={project} className="h-8 w-8 mt-2" alt="" />
                                    ) : notificationObj.category==="Issue"   ? <Image src={issueIcon} className="h-8 w-8 mt-2" alt="" />:notificationObj.category=== "Task" ? <Image src={task} className="h-8 w-8 mt-2" alt="" />:notificationObj.category=== "Snapshot" ? <Image src={cameraIcon} className="h-8 w-8 mt-2" alt="" />:""}  
                                </div>
                            
                              <div className="col-span-7 ">
                               <div className="ml-2">
                              <p className="text-sm overflow-hidden" style={{
                                        wordWrap: 'break-word',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: 'vertical',
                                      }}>{notificationObj.message}</p> </div> 
                               <div>     {date === "TODAY" ? (
                                <div className="ml-2 mt-2">
                                  {getNotifiCationTime(
                                    notificationObj?.createdAt
                                  )}
                                </div>
                              ) : (
                                <div className="ml-2 mt-2" >
                                  {Moment(notificationObj?.createdAt).format(
                                    "hh:mm A"
                                  )}
                                </div>
                              )}</div>
                              </div>
                         
                              </div>
                           
                            </div>
                          {/* {notificationObj?.readAt ? (
                            <div className="px-4 py-4">
                            <div className="grid grid-cols-8 gap-4">
                              <div className="col-span-1 "> 
                              {notificationObj. === "Project" ? (
                                      <Image src={project} className="h-8 w-8 mt-2" alt="" />
                                    ) : notificationObj.notificationType==="Issue"   ? <Image src={issueIcon} className="h-8 w-8 mt-2" alt="" />:notificationObj.notificationType=== "Task" ? <Image src={task} className="h-8 w-8 mt-2" alt="" />:notificationObj.notificationType=== "Snapshot" ? <Image src={cameraIcon} className="h-8 w-8 mt-2" alt="" />:""}
                               </div> 
                              <div className="col-span-7">
                              <div className="ml-2">
                                <p className="text-sm overflow-hidden" style={{
                                      wordWrap: 'break-word',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 4,
                                      WebkitBoxOrient: 'vertical',
                                    }} >{notificationObj?.message}</p>  </div>
                              <div>   {date === "TODAY" ? (
                            <div className="ml-2 mt-2">
                              {getNotifiCationTime(
                                notificationObj?.createdAt
                              )}
                            </div>
                              ) : (
                                <div className="ml-2 mt-2" >
                                  {Moment(notificationObj?.createdAt).format(
                                    "hh:mm A"
                                  )}
                                </div>
                              )}</div>
                              </div>
                              
                            </div>
                            
                          </div>
                       
                          ) : (
                            <div
                                onClick={() => {
                                updateNotifications(notificationObj.id);
                                performNotificationAction(notificationObj)
                              }}
                              className={`${lastChild ? '' : 'border-gray-400  border-b '}  `}
                           >
                              <div className="grid grid-cols-8 gap-4 py-4 px-4 bg-gray-100">
                                <div className="col-span-1">
                                {notificationObj.+
                                   === "Project" ? (
                                      <Image src={project} className="h-8 w-8 mt-2" alt="" />
                                    ) : notificationObj.notificationType==="Issue"   ? <Image src={issueIcon} className="h-8 w-8 mt-2" alt="" />:notificationObj.notificationType=== "Task" ? <Image src={task} className="h-8 w-8 mt-2" alt="" />:notificationObj.notificationType=== "Snapshot" ? <Image src={cameraIcon} className="h-8 w-8 mt-2" alt="" />:""}  
                                </div>
                            
                              <div className="col-span-7 ">
                               <div className="ml-2">
                              <p className="text-sm overflow-hidden" style={{
                                        wordWrap: 'break-word',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: 'vertical',
                                      }}>{notificationObj.message}</p> </div> 
                               <div>     {date === "TODAY" ? (
                                <div className="ml-2 mt-2">
                                  {getNotifiCationTime(
                                    notificationObj?.createdAt
                                  )}
                                </div>
                              ) : (
                                <div className="ml-2 mt-2" >
                                  {Moment(notificationObj?.createdAt).format(
                                    "hh:mm A"
                                  )}
                                </div>
                              )}</div>
                              </div>
                         
                              </div>
                           
                            </div>
                          )} */}
                        </div>
                      </div>
                    );
                  }
                )}
              </ul>
            </div>
          ))}
        {Object.keys(notifications).length > 0 ? (
          <div className="flex justify-between px-2 py-2">

            <div className="">
            <a className="font-normal  text-base leading-[21.79px]  text-[#F1742E]  hover:text-black" onClick={loadMoreData}>
              Load More
            </a>
          </div>
          <div className="">
          <a className="font-normal  text-base leading-[21.79px]  text-[#F1742E]  hover:text-black"   onClick={scrollTop}>
              Top
            </a>
          </div>
          </div>
        ) : (
          <div>
            <h1 className="   top-1/2 bg-opacity-50 left-1/3 rounded p-2  bg-gray-300 text-orange-400 ">
              There is no data avalible to display
            </h1>
          </div>
        )}
      </div>

    </div>


   
  );
};
export default Body;
