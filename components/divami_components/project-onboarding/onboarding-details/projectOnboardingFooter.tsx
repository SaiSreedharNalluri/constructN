


import { Button } from '@mui/material'
import React from 'react'
import { IOnboardingProps } from '../projectOnboarding';
import { useComputed, useSignal } from '@preact/signals-react';

const ProjectOnboardingFooter = ({ step, action }: IOnboardingProps) => {

  const messages = [
    '* Mandatory Field',
    'Hover on each item to see more actions',
    '', '', ''
  ]

  const saveState = useSignal(false)

  const instruction = useComputed(() => messages[step.value])

  const backBtnText = useComputed(() => step.value === 0 ? 'Cancel' : 'Back')

  const nextBtnText = useComputed(() => step.value === 4 ? 'Complete' : 'Next')

  const renderSaveButton = useComputed(() => <Button onClick={onSaveClick} disabled={saveState.value} variant='contained' color='warning' className='mr-2 bg-[#FF853E]'>
    {saveState.value === true ? 'Saved' : 'Save'}
  </Button>)

  const onBackClick = () => {
    // if(step.value === 0) {
    //   router.push("/projects");
    // } else {
    //   step.value--
    // }
    saveState.value = false
    if (action) action.value = `Back-${step.value}`
  }

  const onNextClick = () => {
    // if(step.value < 5) {
    //   step.value++
    // }
    saveState.value = false
    if (action) action.value = `Next-${step.value}`
  }

  const onSaveClick = () => {
    saveState.value = true
  }

  return (
    <div className='flex justify-between items-center mx-[5rem]'>
      <div className='font-semibold text-[#ff0000]'>
        {instruction}
      </div>
      <div className='flex'>
        <Button onClick={onBackClick} variant='outlined' color='warning' className='mr-2'>
          {backBtnText}
        </Button>
        {renderSaveButton}
        <Button onClick={onNextClick} variant='contained' color='warning' className='bg-[#FF853E]'>
          {nextBtnText}
        </Button>
      </div>

    </div>
  )
}

export default ProjectOnboardingFooter