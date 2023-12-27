import React from 'react';
import { Grid, OutlinedInput, FormHelperText } from '@mui/material';
import ProjectImageUpload from './projectImageUpload';
import { computed, useSignal } from '@preact/signals-react';
const ProjectAddress = ({addressDetails,isAddressValid,projectLogo,projectCoverPhoto}:any) => {

  const isValid = computed(() => (
    (addressDetails.value.address?.city !== undefined && addressDetails.value.address?.city !== '') &&
    (addressDetails.value.address?.state !== undefined && addressDetails.value.address?.state !== '')&& 
    (addressDetails.value.address?.country !== undefined && addressDetails.value.address?.country !== '')&& 
    (addressDetails.value.address?.zipcode !== undefined && addressDetails.value.address?.zipcode !== '')
  ))
  isAddressValid.value=isValid.value; 
  const handleAddressChange = (field: string, value: string) => {
    addressDetails.value = {
      ...addressDetails.value,
      address: {
        ...addressDetails.value.address,
        [field]: value,
      },
    };
  };
  return (
    <Grid container spacing={2} className='mt-[2px]' justifyContent="space-between">
    <Grid item xs={3}>
      <div>
        Address
      </div>
      <OutlinedInput
        fullWidth
        size="small"
        className="outline-none"
        multiline
        rows={4.3}
        value={addressDetails.value.address?.line1}
        onChange={(e) => handleAddressChange('line1', e.target.value)}     
        />

    </Grid>
    <Grid item xs={5}>
      <Grid container spacing={1.5}>
        <Grid item xs={6}>
          <div>
            Country*
          </div>
          <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
            value={addressDetails.value.address?.country}
            onChange={(e) => handleAddressChange('country', e.target.value)}
            />
          {(addressDetails.value.address?.country === undefined || addressDetails.value.address?.country === "") && (
          <FormHelperText className='text-[#FF853E]'>Country is required</FormHelperText>
        )}
        </Grid>
        <Grid item xs={6}>
          <div>
            State*
          </div>
          <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
            value={addressDetails.value.address?.state}
            onChange={(e) => handleAddressChange('state', e.target.value)}
            
            />
          {(addressDetails.value.address?.state === undefined || addressDetails.value.address?.state === "") && (
          <FormHelperText className='text-[#FF853E]'>State is required</FormHelperText>
        )}
          </Grid>
        <Grid item xs={6}>
          <div>
            City*
          </div>
          <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
            value={addressDetails.value.address?.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            
            />
              {(addressDetails.value.address?.city === undefined || addressDetails.value.address?.city === "") && (
          <FormHelperText className='text-[#FF853E]'>City is required</FormHelperText>
        )}
        </Grid>
        <Grid item xs={6}>
          <div>
            Zipcode*
          </div>
          <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
            value={addressDetails.value.address?.zipcode}
            onChange={(e) => handleAddressChange('zipcode', e.target.value)}
            />
               {(addressDetails.value.address?.zipcode === undefined || addressDetails.value.address?.zipcode === "") && (
          <FormHelperText className='text-[#FF853E]'>Zipcode is required</FormHelperText>
        )}
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={4} style={{ display: 'flex', alignItems: 'stretch' }}>
 <ProjectImageUpload addressDetails={addressDetails} projectLogo={projectLogo} projectCoverPhoto={projectCoverPhoto} ></ProjectImageUpload>
    </Grid>

  </Grid>
  );
};

export default ProjectAddress;
