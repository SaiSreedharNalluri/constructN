import * as Sentry from "@sentry/nextjs";
import { AxiosError } from "axios";
export default class CustomLoggerClass {
     Sentry_Log_Info=true;
    logInfo=(message:string)=>{
        // console.log(message);
        Sentry.captureMessage(message)
    }
    Sentry_Log_Activity=true;

    logActivity=(userDetails:any,user?:any,)=>{
        if(user){
        Sentry.setUser({[user]:userDetails})
        }
        else{
            Sentry.setUser(userDetails)
        }
    }
    logError=(error:AxiosError|any)=>{
        if(typeof error==="object"){
        const errors=error.message+error.code;
            Sentry.captureException(new Error(errors))
        }
        else if(typeof error==="string"){
            Sentry.captureException(error)
        }

    }
}