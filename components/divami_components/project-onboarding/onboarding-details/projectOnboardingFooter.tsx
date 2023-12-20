


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

    </div>
          </>
        );
       
      default:
        return null;
    }
  };

  return (
    <div className='flex justify-between items-center mx-[60px]'>
      {state.step===OnBoardingStep.ProjectDetails ? <> <div className='  font-semibold'>
        * Mandatory Field
    </div>
    </>  :<div></div>}
<div>
<Button onClick={() => {
  if(state.step>0){
    ProjectAction.goBack()
  }
  else{
  }
}}  style={{marginRight:"10px",color:"#FF853E",border:"1px solid #FF853E"}}>
        Cancel
    </Button>
    <Button onClick={() =>{
      if(state.step<6){
        ProjectAction.next()
      }
      else{
      }
    }} style={{backgroundColor:"#FF853E",marginRight:"10px",color:"white"}}>
        Next
    </Button>
</div>
  
</div>
  )
}

export default ProjectOnboardingFooter