import React, { useEffect, useState } from 'react';
import ProjectAddress from './inputs/projectAddress';
import ProjectLatLngDetails from './inputs/projectLatLngDetails';
import ProjectNameDetails from './inputs/projectNameDetails';
import ProjectTypeDetails from './inputs/projectTypeDetails';
import { createProject, getProjectDetails, updateProjectCover, updateProjectInfo } from '../../../../services/project';
import { useProjectContext } from '../../../../state/projectState/context';
import { Button, Grid, OutlinedInput } from '@mui/material';
import { Address } from '../../../../models/IProjects';
import { useRouter } from 'next/router';
const ProjectOnboardingForm: React.FC = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [allRequiredFieldsEntered, setAllRequiredFieldsEntered] = useState<boolean>(false);
  const [allAddressFieldsEntered, setAllAddressFieldsEntered] = useState<boolean>(false);
  const { state, projectContextAction } =useProjectContext();
  const{ProjectAction}=projectContextAction;
  const requiredFields: string[] = ['name', 'type', 'measurement'];
  const requiredAddressFields: string[] = ['zipcode', 'city', 'state', 'country'];
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const handleProjectImageChange = (file: File | null): void => {
    if(file){
      setProjectImage(file);
    }
    else{
      setProjectImage(null)
    }
  };
  const router = useRouter();
  // console.log(router.query.id);
  
  useEffect(()=>{
  if(router.isReady && router.query.id){
    getProjectDetails(router.query.id as string).then((res)=>{
      console.log(res,"res");
      
      ProjectAction.setNewProjectDetails(res.data.result)
    })
  }
  },[router.isReady]) 
  const handleCoverPhotoChange = (file: File | null): void => {
    if(file){
      setCoverPhoto(file);
    }
    else{
      setCoverPhoto(null)
    }
  };

  const handleFieldChange = (key: string, value: string, isAddressField: boolean = false, isCoordinates = false): void => {
    console.log(key,value);
    
    if (isAddressField) {
      ProjectAction.setNewProjectDetails({
        ...state.newProjectDetails,
        address: {
          ...state.newProjectDetails.address,
          [key]: value,
        },
      });
      setErrors({ ...errors, [`address.${key}`]: '' });
      
      // const allEntered = requiredAddressFields.every(field => {
      //   return field !== key ? !!state.newProjectDetails.address?.[field]?.trim() : !!value.trim();
      // });
      // setAllAddressFieldsEntered(allEntered);
    }
    else if(isCoordinates && key ==='longitude'){
      console.log(isCoordinates);      
      console.log(state.newProjectDetails,'state.newProjectDetails')
      ProjectAction.setNewProjectDetails({
        ...state.newProjectDetails,
        location: {
          type: 'point',
          coordinates: [+value, state.newProjectDetails?.location?.coordinates?.[1]],
        },
      });
      setErrors({ ...errors, [key]: '' });
    }
    else if(isCoordinates && key ==='latitude'){
      console.log(state.newProjectDetails,'state.newProjectDetails')
      ProjectAction.setNewProjectDetails({
        ...state.newProjectDetails,
        location: {
          type: 'point',
          coordinates: [state.newProjectDetails?.location?.coordinates?.[0], +value],
        },
      });
      setErrors({ ...errors, [key]: '' });
    }
     else {
      ProjectAction.setNewProjectDetails({
        ...state.newProjectDetails,
        [key]: value,
      });
  
      setErrors({ ...errors, [key]: '' });
  
      // const allEntered = requiredFields.every(field => {
      //   return field !== key ? !!state.newProjectDetails[field]?.trim() : !!value.trim();
      // });
      // setAllRequiredFieldsEntered(allEntered);
    }
  };

  const handleClick = (): void => {
  
    const newErrors: { [key: string]: string } = {};
  
    requiredFields.forEach((field) => {
      if (!state.newProjectDetails[field]) {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        newErrors[field] = `${fieldName} is required*`;
      }
    });
  
    if (!state.newProjectDetails.location || !state.newProjectDetails.location.coordinates) {
      if (!state.newProjectDetails.location || !state.newProjectDetails.location.coordinates?.[0]) {
        newErrors['latitude'] = 'Latitude is required*';
      }
      if (!state.newProjectDetails.location || !state.newProjectDetails.location.coordinates?.[1]) {
        newErrors['longitude'] = 'Longitude is required*';
      }
    }
    const addressFields: any = state.newProjectDetails.address || {};


if (!state.newProjectDetails.address) {
  newErrors['address'] = 'Address is required';
} else {
  requiredAddressFields.forEach((field) => {
    if (!addressFields[field]) {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      newErrors[`address.${field}`] = `${fieldName} is a required field*`;
    }
  });
}
  
console.log(state.newProjectDetails);
setErrors(newErrors);
if (Object.keys(newErrors).length === 0) {
  const formData = state.newProjectDetails;
  console.log(formData);
  const formdata = new FormData();
  formdata.append('jreq', JSON.stringify(formData));
  if (projectImage) {
    formdata.append('logo', projectImage);
  }

  if (coverPhoto) {
    formdata.append('coverPhoto', coverPhoto);
  }
if(state.newProjectDetails._id===""){
createProject(formdata)
.then((res) => {
  console.log(res);
  
ProjectAction.setNewProjectDetails(res.result);
ProjectAction.next()

})
.catch((error) => {
console.error('Error creating project:', error);
});
}
else{
ProjectAction.next()
  updateProjectInfo(state.newProjectDetails,router.query.id as string).then((res)=>{
    console.log(res,"update details response");
  // ProjectAction.setNewProjectDetails(res.result.data)
  }).catch((error)=>{
    // console.log(error,"error");
    
  })

}  
}
  
  };
  return (
    <div className='mx-[10px]'>
      <ProjectNameDetails
handleChange={handleFieldChange}
        errorMessage={errors}
        setErrorMessage={setErrors}
      />
      <ProjectTypeDetails
handleChange={handleFieldChange}
   
        errorMessage={errors}
        setErrorMessage={setErrors}
      />
      <ProjectLatLngDetails
handleChange={handleFieldChange}
        errorMessage={errors}
        setErrorMessage={setErrors}
      />
      <ProjectAddress
handleAddressChange={handleFieldChange}
        setErrorMessage={setErrors} 
        errorMessage={errors}
        projectImage={projectImage}
        coverPhoto={coverPhoto}
        onProjectImageChange={handleProjectImageChange}
        onCoverPhotoChange={handleCoverPhotoChange}
      />
      {/* {allRequiredFieldsEntered && allAddressFieldsEntered ? "all the required filed are entered ":""} */}
      <Button onClick={handleClick}>submit</Button>
    </div>
  );
};

export default ProjectOnboardingForm;