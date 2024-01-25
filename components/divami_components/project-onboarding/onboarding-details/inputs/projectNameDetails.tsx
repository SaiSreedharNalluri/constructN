import React, { ChangeEvent } from 'react';
import { FormHelperText, Grid, OutlinedInput } from '@mui/material';
import { computed, useComputed, useSignalEffect } from '@preact/signals-react';
import { validateName } from '../../../../../utils/utils';


const ProjectNameDetails = ({
  details, isNameValid, saveState
}: any) => {
  // const { state, projectContextAction } =useProjectContext();

  useSignalEffect(() => {
    isNameValid.value = (details.value.name !== undefined && details.value.name !== '')
  })

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    details.value = { ...details.value, [name]: value }
    if(saveState) saveState.value = true
  }

  const renderContent = useComputed(() => <Grid container spacing={2} justifyContent="space-between" className='mt-[4px]'>
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
      {validateName(details.value.name) !== true && (
        <FormHelperText className='text-[#FF853E]'>Invalid Name</FormHelperText>
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
  </Grid>)

  return (
    <>{renderContent}</>
  );
};

export default ProjectNameDetails