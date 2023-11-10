import LinearProgress from '@mui/material/LinearProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import React from 'react'
interface Iprops{
status:string
}
const FileStatus:React.FC<Iprops>=({status})=>
{
 return(
    <React.Fragment>
        {
            status ==='progress' ?(<div className='w-[60%]'>
                <LinearProgress color='warning'/>
            </div>):(<CheckCircleIcon style={{color:"green"}}/>)
        }
        
    </React.Fragment>
 )
}
export default FileStatus