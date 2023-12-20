import React from 'react';
import { Grid, OutlinedInput, FormControlLabel, Radio, RadioGroup, FormHelperText } from '@mui/material';
import { useProjectContext } from '../../../../../state/projectState/context';
const ProjectLatLngDetails = ({
  handleChange,
  errorMessage,
  setErrorMessage,
}:any) => {

  const { state, projectContextAction } =useProjectContext();
  return (
    <Grid container spacing={2} justifyContent="space-between" alignItems="center" flex="coloum" className='mt-[4px]'>
      <Grid item xs={3}>
        <div>Latitude*</div>
        <OutlinedInput
          fullWidth
          size="small"
          className="outline-none"
          value={state?.newProjectDetails?.location?.coordinates?.[1] || ''}
          onChange={(e)=>{handleChange("latitude",e.target.value,false,true)}}
        />
        {errorMessage.latitude && typeof errorMessage.latitude === 'string' && (
          <FormHelperText className='text-[#FF853E]'>{errorMessage.latitude}</FormHelperText>
        )}
      </Grid>
      <Grid item xs={3}>
        <div>Longitude*</div>
        <OutlinedInput
          fullWidth
          size="small"
          className="outline-none"
          value={state?.newProjectDetails?.location?.coordinates?.[0] || ''}
          onChange={(e)=>{handleChange("longitude",e.target.value,false,true)}}
        />
        {errorMessage.longitude && typeof errorMessage.longitude === 'string' && (
          <FormHelperText className='text-[#FF853E]'>{errorMessage.longitude}</FormHelperText>
        )}
      </Grid>
      <Grid item xs={2} className='mt-[16px]'>
        <div>Measurement System*</div>
      </Grid>
      <Grid item xs={4} className='mt-[16px]'>
        <RadioGroup row value={state.newProjectDetails.measurement || "US"}   onChange={(e)=>{handleChange("measurement",e.target.value)}}>
          <FormControlLabel value="US" control={<Radio />} label="US (ft,pound)" />
          <FormControlLabel value="metric" control={<Radio />} label="Metric System (m,kg)" />
        </RadioGroup>
        {errorMessage.measurement && typeof errorMessage.measurement === 'string' && (
          <FormHelperText className='text-[#FF853E]'>{errorMessage.measurement}</FormHelperText>
        )}
      </Grid>
    </Grid>
  );
};

export default ProjectLatLngDetails;