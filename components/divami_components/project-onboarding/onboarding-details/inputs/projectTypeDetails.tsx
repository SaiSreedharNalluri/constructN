import React, { ChangeEvent } from 'react';
import { FormHelperText, Grid, MenuItem, OutlinedInput, Select } from '@mui/material';
import { computed, useSignal } from '@preact/signals-react';
import { useProjectContext } from '../../../../../state/projectState/context';
import { IProjects } from '../../../../../models/IProjects';
const ProjectTypeDetails = ({
type,isTypeValid
}:any) => {
  const isValid = computed(() => (
    (type.value.type !== undefined && type.value.type !== '') ))
isTypeValid.value=isValid.value
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target
    type.value = {...type.value, [name]: value}
  }

  return (
    <Grid container spacing={2} justifyContent="space-between" className='mt-[4px]'>
      <Grid item xs={3}>
        <div>Project ID</div>
        <OutlinedInput
         fullWidth
         size="small"
          className="outline-none"
          name='projectID'
          value={type.value.projectID}
          onChange={
            handleOnChange}
        />
      </Grid>
      <Grid item xs={3}>
        <div>Project Type*</div>
        <Select
        fullWidth
        size="small"
        name='type'
        value={type.value.projectID}
        onChange={handleOnChange}
      >
        <MenuItem value="Residential">Residential</MenuItem>
        <MenuItem value="Building">Building</MenuItem>
      </Select>
      {(type.value.type === undefined || type.value.type === "") && (
          <FormHelperText className='text-[#FF853E]'>Project type is required</FormHelperText>
        )}
      </Grid>
      <Grid item xs={6}>
        <div>How do you intend to leverage ConstructN for this project?</div>
        <OutlinedInput
          fullWidth
          size="small"
          className="outline-none"
          value={type.value.metaDetails?.projectIntend}
          onChange={handleOnChange}
          name='projectIntend'
        />        
      </Grid>
    </Grid>
  );
};

export default ProjectTypeDetails;