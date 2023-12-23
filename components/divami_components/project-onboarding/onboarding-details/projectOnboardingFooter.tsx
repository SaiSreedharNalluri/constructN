


import { Button } from '@mui/material'
import React from 'react'
import { IOnboardingProps } from '../projectOnboarding';
import { useSignal } from '@preact/signals-react';

const ProjectOnboardingFooter = ({ step, action }: IOnboardingProps) => {

  const messages = useSignal([
    '* Mandatory Field',
    'Hover on each item to see more actions',
    '', '', ''
  ])

  const onBackClick = () => {
    // if(step.value === 0) {
    //   router.push("/projects");
    // } else {
    //   step.value--
    // }
    if(action) action.value = `Back-${step.value}`
  }

  const onNextClick = () => {
    // if(step.value < 5) {
    //   step.value++
    // }
    if(action) action.value = `Next-${step.value}`
  }

  return (
    <div className='flex justify-between items-center mx-[60px]'>
      <div className='font-semibold text-[#ff0000]'>
        {messages.value[step.value]}
      </div>
      <div>
        <Button onClick={onBackClick} style={{ marginRight: "10px", color: "#FF853E", border: "1px solid #FF853E" }}>
          { step.value === 0 ? 'Cancel' : 'Back' }
        </Button>
        <Button onClick={onNextClick} style={{ backgroundColor: "#FF853E", marginRight: "10px", color: "white" }}>
          { step.value === 4 ? 'Complete' : 'Next' }
        </Button>
      </div>

    </div>
  )
}

export default ProjectOnboardingFooter