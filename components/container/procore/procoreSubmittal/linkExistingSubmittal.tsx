import React, { useEffect, useState } from 'react';
import { Radio, Button } from '@mui/material';
import {
  BodyContainer,
  CustomTaskProcoreLinks,
} from '../../../divami_components/issue_detail/IssueDetailStyles';
import ProcoreHeader from '../procoreHeader';
import ProcoreFooter from '../procoreFooter';
import { ListRfi,linkIssueSubmittal,linkTaskSubmittal,listObservation, listSubmittal } from '../../../../services/procore';
import CustomLoader from '../../../divami_components/custom_loader/CustomLoader';
import { CustomToast } from '../../../divami_components/custom-toaster/CustomToast';

const LinkExistingSubmittal = (props: any) => {
  const {issue,
    task,
    handleCloseProcore}=props as any;
  const [loading, setLoading] = useState(false)
  const { handleInstance,} = props as any;
  
  const [submittalData,setSubmittalData] = useState<any[]>([]);
  const [footerState, SetFooterState] = useState(true);

  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handleBack = () => {
    let closeNewRFI: IprocoreActions = {
      action: 'newCloseObservation',
      status: false,
    };
    handleInstance(closeNewRFI);
  };

  const handleRadioChange = (rfinumber: number) => {
    setSelectedItem(rfinumber);
  };

  const handleLink = () => {
    if (issue) {

      linkIssueSubmittal(issue.project, issue._id,selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {
            CustomToast("Submittal linked successfully", 'success');
            handleCloseProcore();
          }
        })
        .catch((linkError) => {
          if (linkError) {
            CustomToast("Linking Submittal failed", 'error');
          }
        });
    } else {
      linkTaskSubmittal(task.project, task._id, selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {
            CustomToast("Submittal linked successfully", 'success');
            handleCloseProcore();
          }
        })
        .catch((linkError) => {
          if (linkError) {
            CustomToast("Linking Submittal failed", 'error');
          }
        });
    }
  };


  useEffect(() => {
    setLoading(true)
    listSubmittal()
    .then((response: any) => {
      setSubmittalData(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching RFI data:', error);
    });
   
  }, [])
  

  return (
    <>
      <CustomTaskProcoreLinks>
        <ProcoreHeader handleInstances={handleBack} heading={'Existing Submittal'}></ProcoreHeader>
        {loading?(<div>
        <CustomLoader></CustomLoader>
      </div>):(<div>
        <BodyContainer footerState={footerState} className='h-[400px]'>
        <h3><b>Choose Anyone Submittal to Link.</b></h3>
          {submittalData && submittalData.length > 0 && (
            <ul>
           { submittalData.map((rfi:any) => (
              <div key={rfi.id} className="rfi-item">
                <Radio
                  checked={selectedItem === rfi.id}
                  onChange={() => handleRadioChange(rfi.id)}
                />
                <label htmlFor={`rfiRadio${rfi.id}`}>
                  {`${rfi.title} (${rfi.number})`}
                </label>
              </div>
            ))}
            </ul>
          )}
        
           
         
        </BodyContainer>
        <Button className={`mt-4 p-2 w-[150px] font-medium py-2 px-4 rounded hover:bg-border-yellow hover:text-box-white ${
        !selectedItem
          ? 'bg-gray-300 text-white'
          : 'bg-border-yellow text-box-white border border-solid border-border-yellow'
      }`} disabled={!selectedItem}  onClick={handleLink}>
              Link
            </Button>
        
        </div>)}
        
      </CustomTaskProcoreLinks>
    </>
  );
};

export default LinkExistingSubmittal;
