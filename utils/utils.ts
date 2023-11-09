import moment from "moment-timezone";
import { getCookie } from "cookies-next";
import ExifReader from "exifreader";
import { IGCP } from "../models/IGCP";
import { ChildrenEntity, IStructure } from "../models/IStructure";
import { delimiter } from "path";


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
        console.log('checked isutm')
        gcplist.utmLocation=[]
        for( let i=0; i<minimumGCPPoints; i++){

            gcplist.utmLocation.push({
                easting: 0,
                northing: 0,
                elevation: 0,
                zone: ""
            })
        }
    }else{
        console.log('checked latlng')
        gcplist.location=[]
        for( let i=0; i<minimumGCPPoints; i++){
            gcplist.location.push({
                coordinates: [0,0],
                type: "point",
                elevation: 0,
            })
        }
    }
    return gcplist;
};

export const getPathToRoot = (structureId: String, hierarchy: ChildrenEntity, delimiter:delimiterType = " > "): string => {
    const getPath = (structureId: String, hierarchy: ChildrenEntity, delimiter:delimiterType = " > "): string => {
        if(structureId === hierarchy._id) {
            return delimiter + hierarchy.name
        } else if (hierarchy.children && hierarchy.children?.length > 0) {
            let val = hierarchy.children.reduce<string>((path, element): string => {
                return path += getPath(structureId, element, delimiter)
            }, "");
            if (val.length > 0) {
                val = delimiter + hierarchy.name + val
            }
            return val
        } else {
            return ""
        }
    }
    let path = getPath(structureId, hierarchy, delimiter)
    // console.log("TestingUploader: ", path.substring(1))
    return path.substring(2)
}

export type delimiterType = " / " | " > "

  