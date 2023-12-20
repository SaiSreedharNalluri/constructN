import React from 'react';
import { FormHelperText, Grid, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useProjectContext } from '../../../../../state/projectState/context';
const ProjectTypeDetails = ({
  handleChange,
  errorMessage,
  setErrorMessage,
}:any) => {

  const { state, projectContextAction } =useProjectContext();

  return (
    <Grid container spacing={2} justifyContent="space-between" className='mt-[4px]'>
      <Grid item xs={3}>
        <div>Project ID</div>
        <OutlinedInput
         fullWidth
         size="small"
          className="outline-none"
          value={state.newProjectDetails.projectID || ''}
          onChange={(e)=>{
            handleChange("projectID",e.target.value)
            setErrorMessage({ ...errorMessage, projectID: '' }); 
          }}
        />
        {errorMessage.projectId && typeof errorMessage.projectId === 'string' && (
          <FormHelperText className='text-[#FF853E]'>{errorMessage.projectId}</FormHelperText>
        )}
      </Grid>
      <Grid item xs={3}>
        <div>Project Type*</div>
        <Select
        fullWidth
        size="small"
        value={state.newProjectDetails.type || ''}
        onChange={(e) => {
          handleChange("type", e.target.value);
        }}
      >
        <MenuItem value="Residential">Residential</MenuItem>
        <MenuItem value="Building">Building</MenuItem>
      </Select>
        {errorMessage.type && typeof errorMessage.type === 'string' && (
          <FormHelperText className='text-[#FF853E]'>{errorMessage.type}</FormHelperText>
        )}
      </Grid>
      <Grid item xs={6}>
        <div>How do you intend to leverage ConstructN for this project?</div>
        <OutlinedInput
          fullWidth
          size="small"
          className="outline-none"
          value={state.newProjectDetails.description || ''}
          onChange={(e)=>handleChange("intend",e.target.value)}
        />
        {errorMessage.leverageConstuctN && typeof errorMessage.leverageConstuctN === 'string' && (
          <FormHelperText className='text-[#FF853E]'>{errorMessage.leverageConstuctN}</FormHelperText>
        )}
      </Grid>
    </Grid>
  );
};

export default ProjectTypeDetails;