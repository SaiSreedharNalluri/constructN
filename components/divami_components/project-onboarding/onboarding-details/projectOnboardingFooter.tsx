import { Button } from '@mui/material'
import React from 'react'
import { useProjectContext } from '../../../../state/projectState/context'
import { OnBoardingStep } from '../../../../state/projectState/state';

const ProjectOnboardingFooter = () => {
  const { state, projectContextAction } =useProjectContext();
  const{ProjectAction}=projectContextAction;
  const renderButtons = () => {
    switch (state.step) {
      case OnBoardingStep.ProjectDetails:
        return (
          <>
    <div className='mt-[8px]'>
    <Button style={{marginRight:"10px",color:"#FF853E",border:"1px solid #FF853E"}}>
        Cancel
    </Button>
    <Button onClick={() => ProjectAction.next()} style={{backgroundColor:"#FF853E",marginRight:"10px",color:"white"}}>
        Next
    </Button>
    </div>
          </>
        );
        case OnBoardingStep.AddUsers:
          return (
            <>
      <div className='mt-[8px]'>
      <Button   style={{marginRight:"10px",color:"#FF853E",border:"1px solid #FF853E"}}>
          Cancel
      </Button>
      <Button style={{backgroundColor:"#FF853E",marginRight:"10px",color:"white"}}>
          Next
      </Button>
      </div>
            </>
          );
      default:
        return null;
    }
  };

  return (
    <div className='flex justify-between mx-[60px]'>
      {state.step===OnBoardingStep.ProjectDetails ? <> <div className='mt-[15px]  font-semibold'>
        * Mandatory Field
    </div>

    </>  :""}
<div>
  {renderButtons()}
</div>
  
</div>
  )
}

export default ProjectOnboardingFooter