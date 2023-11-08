import moment from "moment-timezone";
import { getCookie } from "cookies-next";
import ExifReader from "exifreader";
import { IGCP } from "../models/IGCP";


/**
 * 
 * @param date Date object carrying the time to be converted to project timezone
 * @returns moment object converted to project timezone. If project doesnot have timezone, time will be returned in local timezone.
 */
export const getTimeInProjectTimezone = (date: Date): moment.Moment => {
    const projectInfo:any = getCookie('projectData')as string;
    let formatedTime;
    let projectObj: any;

    if(projectInfo !== undefined && projectInfo!==null) {
        projectObj = JSON.parse(projectInfo)?.find((each: any)=>each?._id === new URL(window?.location?.href)?.pathname?.split("/")[2]);
    }

    if(getCookie('isProjectTimeZone') && projectObj!==undefined && projectObj !==null && projectObj?.timeZone) {
        formatedTime = moment.tz(moment(date).format("yyyy-MM-DD HH:mm"), projectObj?.timeZone);
    } else {
        formatedTime = moment(moment(date).format("yyyy-MM-DD HH:mm"))?.local();
    }

    return formatedTime;
}


export const getEXIFDataFromImageFile = async (file: File): Promise<ExifReader.Tags> => {
    let exifData: ExifReader.Tags = await ExifReader.load(file)
    return exifData
}

export const getInitialGCPList = (isUTM: boolean): IGCP => {
    let minimumGCPPoints=4;
    let gcplist:IGCP={};
    if(isUTM){
        gcplist.utmLocation=[]
        for( let i=0; i>minimumGCPPoints; i++){
        
            // gcplist.({
            //  utmLocation:{

            //  }  
            // })
        }
    }else{

    }
    
   
     return gcplist;
  };
  