import React from 'react'
import ProjectAddress from './inputs/projectAddress';
import ProjectLatLngDetails from './inputs/projectLatLngDetails';
import ProjectNameDetails from './inputs/projectNameDetails';
import ProjectTypeDetails from './inputs/projectTypeDetails';
const ProjectOnboardingForm = () => {
  return (
    <div className='mx-[60px]'>
      <ProjectNameDetails></ProjectNameDetails>
      <ProjectTypeDetails></ProjectTypeDetails>
      <ProjectLatLngDetails></ProjectLatLngDetails>
      <ProjectAddress></ProjectAddress>
      </div>
  )
}

export default ProjectOnboardingForm;