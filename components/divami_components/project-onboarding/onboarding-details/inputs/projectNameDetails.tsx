import React from 'react';
import { FormHelperText, Grid, OutlinedInput } from '@mui/material';
import { useProjectContext } from '../../../../../state/projectState/context';


const ProjectNameDetails = ({
handleChange,
  errorMessage,
  setErrorMessage,
}:any) => {
  const { state, projectContextAction } =useProjectContext();

  return (
    <Grid container spacing={2} justifyContent="space-between" className='mt-[4px]'>
      <Grid item xs={6}>
        <div>Project Name*</div>
        <OutlinedInput
          fullWidth
          size="small"
          className="outline-none"
          value={state.newProjectDetails.name || ''}
          onChange={(e)=>{
            handleChange('name', e.target.value)
            setErrorMessage({ ...errorMessage, name: '' });
          }}
        />
        {errorMessage.name && (
          <FormHelperText className='text-[#FF853E]'>{errorMessage.name}</FormHelperText>
        )}
      </Grid>
      <Grid item xs={6}>
        <div>Project NickName</div>
        <OutlinedInput
          fullWidth
          size="small"
          className="outline-none"
          value={state.newProjectDetails.projectNickName || ''}
          onChange={(e)=>{
            handleChange('projectNickName', e.target.value)
            setErrorMessage({ ...errorMessage, nickName: '' });
          }}
        />
        {errorMessage.nickName && typeof errorMessage.nickName === 'string' && (
          <FormHelperText className='text-[#FF853E]'>{errorMessage.projectNickName}</FormHelperText>
        )}
      </Grid>
    </Grid>
  );
};

export default ProjectNameDetails