import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { FormHelperText, Grid, OutlinedInput } from '@mui/material';
import { useProjectContext } from '../../../../../state/projectState/context';
import { IProjects } from '../../../../../models/IProjects';
import { computed, useSignal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';


const ProjectNameDetails = ({
details,isNameValid
}:any) => {
  // const { state, projectContextAction } =useProjectContext();
  
  console.log(details)
  const isValid = computed(() => (
    (details.value.name !== undefined && details.value.name !== '') ))
    isNameValid.value=isValid.value 

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target
    details.value = {...details.value, [name]: value}
  }

  return (
    <Grid container spacing={2} justifyContent="space-between" className='mt-[4px]'>
      <Grid item xs={6}>
        <div>Project Name*</div>
        <OutlinedInput
          fullWidth
          name='name'
          size="small"
          className="outline-none"
          value={details.value.name}
          onChange={handleOnChange}
        />
        {(details.value.name === undefined || details.value.name === '') && (
          <FormHelperText className='text-[#FF853E]'>Name is required</FormHelperText>
        )}
      </Grid>
      <Grid item xs={6}>
        <div>Project NickName</div>
        <OutlinedInput
          fullWidth
          name='nickName'
          size="small"
          className="outline-none"
          value={details.value.nickName}
          onChange={handleOnChange}
        />

      </Grid>
    </Grid>
  );
};

export default ProjectNameDetails