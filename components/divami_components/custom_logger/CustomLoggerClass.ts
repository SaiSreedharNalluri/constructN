import * as Sentry from "@sentry/nextjs";
import { AxiosError } from "axios";
const islogInfo=process.env.NEXT_PUBLIC_LOG_INFO?process.env.NEXT_PUBLIC_LOG_INFO==="true"?true:false:false;
const islogActivity=process.env.NEXT_PUBLIC_LOG_ACTIVITY?process.env.NEXT_PUBLIC_LOG_ACTIVITY==="true"?true:false:false;
const islogError=process.env.NEXT_PUBLIC_LOG_ERROR?process.env.NEXT_PUBLIC_LOG_ERROR==="true"?true:false:false;

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
