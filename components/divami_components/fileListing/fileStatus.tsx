import LinearProgress from '@mui/material/LinearProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import React from 'react'
interface Iprops{
status:string
}

const FileStatus:React.FC<Iprops>=({status})=>
{
const showUploadingStatus=(status:string)=>{
    switch(status)
    {
        case 'progress':
        return(<div className='w-[60%]'>
        <LinearProgress color='warning'/>
        </div>)
         case 'done':
         return(<CheckCircleIcon style={{color:"green"}}/>)
         case 'error':
         return(<ErrorIcon color='error'/>)
         default:
         return "";
    }
}
 return(
    <React.Fragment>
        {showUploadingStatus(status)}
    </React.Fragment>
 )
}
export default FileStatus