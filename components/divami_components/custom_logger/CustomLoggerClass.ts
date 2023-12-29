import * as Sentry from "@sentry/nextjs";
import { AxiosError } from "axios";
import { SENTRY } from "../../../config/config";
const islogInfo=SENTRY.LOG_INFO?SENTRY.LOG_INFO==="true"?true:false:false;
const islogActivity=SENTRY.LOG_ACTIVITY?SENTRY.LOG_ACTIVITY==="true"?true:false:false;
const islogError=SENTRY.LOG_ERROR?SENTRY.LOG_ERROR==="true"?true:false:false;

export default class CustomLoggerClass {
    logInfo=(message:string)=>{
        if(islogInfo){ 
        Sentry.captureMessage(message)
        }
    }
    logActivity=(userDetails:any,user?:any,)=>{
        if(islogActivity){
        if(user){
        Sentry.setUser({[user]:userDetails})
        }
        else{
            Sentry.setUser(userDetails)
        }}
    }
    logError=(error:AxiosError|any)=>{
        if(islogError){
        if(typeof error==="object"){
        const errors=error.message+error.code;
            Sentry.captureException(new Error(errors))
        }
        else if(typeof error==="string"){
            Sentry.captureException(error)
        }

    }
    }

}
