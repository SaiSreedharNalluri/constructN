import React, { useEffect, useState } from 'react';
import { Radio, Button } from '@mui/material';
import {
  BodyContainer,
  CustomTaskProcoreLinks,
} from '../../../divami_components/issue_detail/IssueDetailStyles';
import ProcoreHeader from '../procoreHeader';
import ProcoreFooter from '../procoreFooter';
import { ListRfi, linkIssueObservation, linkTaskObservation, listObservation } from '../../../../services/procore';
import CustomLoader from '../../../divami_components/custom_loader/CustomLoader';
import { CustomToast } from '../../../divami_components/custom-toaster/CustomToast';

const LinkExistingObservation = (props: any) => {
  const {issue,
    task,
    handleCloseProcore}=props as any;
  const [loading, setLoading] = useState(false)
  const { handleInstance } = props as any;
  const [footerState, SetFooterState] = useState(true);
  const [observationData, setObservationData] = useState<any>({});
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
     
      linkIssueObservation(issue.project, issue._id,selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {
            CustomToast("Observation linked successfully", 'success');
            handleCloseProcore();
          }
        })
        .catch((linkError) => {
          if (linkError) {
            CustomToast("Linking observation failed", 'error');
          }
        });
    } else {
      linkTaskObservation(task.project, task._id, selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {
            CustomToast("Observation linked successfully", 'success');
            handleCloseProcore();
          }
        })
        .catch((linkError) => {
          if (linkError) {
            CustomToast("Linking Observation failed", 'error');
          }
        });
    }
  };

  useEffect(() => {
    setLoading(true)
    listObservation()
      .then((response: any) => {
      
        
        setObservationData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching RFI data:', error);
      });
     
    }, [])

  return (
    <>
      <CustomTaskProcoreLinks>
        <ProcoreHeader handleInstances={handleBack} heading={'Existing Observation'}></ProcoreHeader>
        {loading?(<div>
        <CustomLoader></CustomLoader>
      </div>):(<div>
        <BodyContainer footerState={footerState} className='h-[400px]'>
           <h3><b>Choose Anyone Observation to Link.</b></h3>
          {observationData && observationData.length > 0 && (
            <ul>
              {observationData.map((item: any) => (
               <div key={item.id} className="rfi-item">
               <Radio
                 checked={selectedItem === item.id}
                 onChange={() => handleRadioChange(item.id)}
               />
               <label htmlFor={`rfiRadio${item.id}`}>
                 {`${item.name} (${item.number})`}
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

export default LinkExistingObservation;
