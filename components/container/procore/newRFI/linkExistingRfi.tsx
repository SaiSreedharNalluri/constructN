import React, { useEffect, useState } from 'react';
import { Radio, Button } from '@mui/material';
import {
  BodyContainer,
  CustomTaskProcoreLinks,
} from '../../../divami_components/issue_detail/IssueDetailStyles';
import ProcoreHeader from '../procoreHeader';
import ProcoreFooter from '../procoreFooter';
import { ListRfi, linkIssueRfi,linkTaskRfi, } from '../../../../services/procore';
import CustomLoader from '../../../divami_components/custom_loader/CustomLoader';
import { CustomToast } from '../../../divami_components/custom-toaster/CustomToast';
import { IprocoreActions } from '../../../../models/Iprocore';

const LinkExistingRfi = (props: any) => {
  const {issue,task,
    handleCloseProcore,
    getIssues,
    getTasks,}=props as any;
  const [loading, setLoading] = useState(false)
  const { handleInstance } = props as any;
  const [footerState, SetFooterState] = useState(true);
  const [rfiData, setRfiData] = useState<any[]>([]);
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
     
      linkIssueRfi(issue.project, issue._id, selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {
            CustomToast("RFI linked successfully", 'success');
            getIssues(issue.structure)
            handleCloseProcore();
          }
        })
        .catch((linkError) => {
          if (linkError) {
            CustomToast("Linking RFI failed", 'error');
          }
        });
    } else {
      linkTaskRfi(task.project, task._id, selectedItem)
        .then((linkResponse) => {
          if (linkResponse) {
            CustomToast("RFI linked successfully", 'success');
            getTasks(task.structure)
            handleCloseProcore();
          }
        })
        .catch((linkError) => {
          if (linkError) {
            CustomToast("Linking RFI failed", 'error');
          }
        });
    }
  };

  useEffect(() => {
    setLoading(true)
    ListRfi()
      .then((response: any) => {
      
        setRfiData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching RFI data:', error);
      });
    }, [])

  return (
    <>
      <CustomTaskProcoreLinks>
        <ProcoreHeader handleInstances={handleBack} heading={'Existing RFI'}></ProcoreHeader>
        {loading?(<div>
        <CustomLoader></CustomLoader>
      </div>):(<div>
        <BodyContainer footerState={footerState} className='h-[400px]'>
        <h3><b>Choose Anyone RFI to Link.</b></h3>
          {Array.isArray(rfiData) &&
            rfiData.map((rfi) => (
              <div key={rfi.id} className="rfi-item">
                <Radio
                  checked={selectedItem === rfi.id}
                  onChange={() => handleRadioChange(rfi.id)}
                />
                <label htmlFor={`rfiRadio${rfi.id}`}>
                  {`${rfi.subject} (#${rfi.full_number})`}
                </label>
              </div>
            ))}
         
            
          
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

export default LinkExistingRfi;
