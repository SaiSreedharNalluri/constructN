import { Button } from "@mui/material";
import { getCookie } from "cookies-next";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Checkbox } from "@mui/material";
import { useState } from "react";


interface Props { 
    projectId?: string; 
    assetId?: string; 
    structure?: string;
    captureDate?: string;
    category?: string;
    assetName?: string;
};

const EmailButton = ({ projectId, assetId , structure, captureDate, category, assetName }: Props) => {
    const [openInBrowser, setOpenInBrowser] = useState(false);
    const projectInfo = getCookie('projectData') || '[]';
    const projectName = JSON.parse(projectInfo as string)?.find((each: any) => each._id === projectId)?.name;
    const sendEmail = () => {
        const subject = encodeURIComponent(`Discrepancy in ${projectName} - ${structure} in Category: '${category}'`);
        const subjectWithAssetDetails = encodeURIComponent(`Discrepancy in ${projectName} - ${structure} and Asset Name: '${assetName}' with Id: '${assetId}' in Category: '${category}'`)
        const body = encodeURIComponent(`Hi,

        I want to report an issue for

        Project Name : ${projectName}

        Hierarchy: ${structure}

        Capture Date: ${captureDate}

        Category : ${category}
        
        Please elaborate on the issue below this line. Request to not modify the above text
        __________________________________________________________________`)
        const bodyWithAssetDetails = encodeURIComponent(`Hi,

        I want to report an issue for

        Project Name : ${projectName}

        Hierarchy:  ${structure}

        Capture Date: ${captureDate}

        Category : ${category}

        Asset Name: ${assetName}
        
        Please elaborate on the issue below this line. Request to not modify the above text
        _______________________________________________________________________________`)

        const emailBody = assetId ? bodyWithAssetDetails : body;

        const emailSubject = assetId ? subjectWithAssetDetails : subject;

        if(openInBrowser){
            window.open(`https://mail.google.com/mail/u/0/?fs=1&to=support@constructn.ai&su=${emailSubject}&body=${emailBody}&tf=cm`,'_blank')
        }else{
            const emailLink = `mailto:support@constructn.ai?subject=${emailSubject}&body=${emailBody}`;
            window.location.href = emailLink;
        }
        
    };

    return (
        <div className="flex justify-end w-full">
            <div className="flex pl-4 p-1 items-center">
                <Checkbox 
                className="p-0 m-0" 
                sx={{
						'&.Mui-checked': {
						color: '#F1742E',
						},
					}} onChange={(e:any)=> setOpenInBrowser(e.target.checked)} checked={openInBrowser} />
                <div className="text-[12px] font-[400]">Open in Browser</div>
            </div>
            <Button onClick={sendEmail} className='normal-case text-black text-[12px]' >
                Report Discrepancy <MailOutlineIcon className='mx-2 text-[14px]' />
            </Button>
        </div>
    );
};

export default EmailButton;