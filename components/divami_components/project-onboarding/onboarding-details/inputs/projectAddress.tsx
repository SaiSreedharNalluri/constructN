import React from 'react';
import { Grid, OutlinedInput, FormHelperText } from '@mui/material';
import ProjectImageUpload from './projectImageUpload';
import { computed, useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { validateText } from '../../../../../utils/utils';
const ProjectAddress = ({ addressDetails, isAddressValid, projectLogo, projectCoverPhoto }: any) => {

  const isValid = computed(() => (
    (addressDetails.value.address?.city !== undefined && addressDetails.value.address?.city !== '') &&
    (addressDetails.value.address?.state !== undefined && addressDetails.value.address?.state !== '') &&
    (addressDetails.value.address?.country !== undefined && addressDetails.value.address?.country !== '') &&
    (addressDetails.value.address?.zipcode !== undefined && addressDetails.value.address?.zipcode !== '')
  ))
  isAddressValid.value = isValid.value;

  useSignalEffect(() => {
    isAddressValid.value = (
      (addressDetails.value.address?.city !== undefined && addressDetails.value.address?.city !== '') &&
      (addressDetails.value.address?.state !== undefined && addressDetails.value.address?.state !== '') &&
      (addressDetails.value.address?.country !== undefined && addressDetails.value.address?.country !== '') &&
      (addressDetails.value.address?.zipcode !== undefined && addressDetails.value.address?.zipcode !== '')
    )
  })
  const handleAddressChange = (field: string, value: string) => {
    addressDetails.value = {
      ...addressDetails.value,
      address: {
        ...addressDetails.value.address,
        [field]: value,
      },
    };
  };

  const renderContent = useComputed(() => <Grid container spacing={2} className='mt-[2px]' justifyContent="space-between">
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
          {validateText(addressDetails.value.address?.country) !== true && (
            <FormHelperText className='text-[#FF853E]'>Invalid Country</FormHelperText>
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
          {validateText(addressDetails.value.address?.state) !== true && (
            <FormHelperText className='text-[#FF853E]'>Invalid State</FormHelperText>
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
          {validateText(addressDetails.value.address?.city) !== true && (
            <FormHelperText className='text-[#FF853E]'>Invalid City</FormHelperText>
          )}
        </Grid>
        <Grid item xs={6}>
          <div>
            Zipcode*
          </div>
          <OutlinedInput
            fullWidth
            size="small"
            type='number'
            className="outline-none"
            value={addressDetails.value.address?.zipcode}
            onChange={(e) => handleAddressChange('zipcode', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === '-' || e.code === 'Minus') {
                e.preventDefault();
              }
            }}
          />
          {(addressDetails.value.address?.zipcode === "") && (
            <FormHelperText className='text-[#FF853E]'>Zipcode is required</FormHelperText>
          )}
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={4} style={{ display: 'flex', alignItems: 'stretch' }}>
      <ProjectImageUpload addressDetails={addressDetails} projectLogo={projectLogo} projectCoverPhoto={projectCoverPhoto} ></ProjectImageUpload>
    </Grid>

  </Grid>)

  return (
    <>{renderContent}</>
  );
};

export default ProjectAddress;
