import * as Sentry from "@sentry/nextjs";
import { AxiosError } from "axios";
const islogInfo=process.env.NEXT_PUBLIC_LOG_INFO?process.env.NEXT_PUBLIC_LOG_INFO==="true"?true:false:false;
export default class CustomLoggerClass {
    logInfo=(message:string)=>{
        if(islogInfo){
        Sentry.captureMessage(message)
        }
    }
    logActivity=(userDetails:any,user?:any,)=>{
        if(islogInfo){
        if(user){
        Sentry.setUser({[user]:userDetails})
        }
        else{
            Sentry.setUser(userDetails)
        }}
    }
    logError=(error:AxiosError|any)=>{
        if(islogInfo){
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
