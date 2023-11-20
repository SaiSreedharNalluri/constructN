import LinearProgress from '@mui/material/LinearProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import React from 'react'
import { UploadStatus } from '../../../models/IUploader';
interface Iprops{
status: UploadStatus
}

const FileStatus:React.FC<Iprops>=({status})=>
{
const showUploadingStatus=(status: UploadStatus)=>{
    switch (status) {
      case 0:
        return (
          <div className="w-[60%]">
            <LinearProgress color="warning" />
          </div>
        );
      case 1:
        return <CheckCircleIcon style={{ color: "green" }} />;
      case 2:
        return <ErrorIcon color="error" />;
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