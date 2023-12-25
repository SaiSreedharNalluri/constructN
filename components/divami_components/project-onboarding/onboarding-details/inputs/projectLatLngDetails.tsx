import React, { ChangeEvent } from 'react';
import { Grid, OutlinedInput, FormControlLabel, Radio, RadioGroup, FormHelperText } from '@mui/material';
import { useProjectContext } from '../../../../../state/projectState/context';
import { IProjects } from '../../../../../models/IProjects';
import { computed, effect, useSignal } from '@preact/signals-react';
const ProjectLatLngDetails = ({latlngDetails,isLatLngValid}:any) => {
  const isValid = computed(() => (
    (latlngDetails.value.location?.coordinates?.[0] !== undefined || latlngDetails.value.location?.coordinates?.[0] !== ""))
    && (latlngDetails.value.location?.coordinates?.[1] !== undefined || latlngDetails.value.location?.coordinates?.[1] !== "")
    && (latlngDetails.value.measurement === undefined || latlngDetails.value.measurement !=="")
    )

isLatLngValid.value=isValid.value
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>, key: string) => {
    
    const { value } = event.target;
    const newCoordinates = [...(latlngDetails.value.location?.coordinates || [])]; 

    if (key === 'latitude') {
      newCoordinates[1] = parseFloat(value); 
    } else if (key === 'longitude') {
      newCoordinates[0] = parseFloat(value); 
    }

    latlngDetails.value = {
      ...latlngDetails.value,
      location: {
        type:"point",
        ...latlngDetails.value.location,
        coordinates: newCoordinates,
      },
    };
  };
  const handleMeasurementChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    latlngDetails.value = {
      ...latlngDetails.value,
      measurement: value,
    };
  };
    
  const setDefaultMeasurement = () => {
    if (latlngDetails.value.measurement === undefined) {
      latlngDetails.value = {
        ...latlngDetails.value,
        measurement: 'US', 
      };
    }
  };

  effect(() => {
    setDefaultMeasurement(); 
  });

  return (
    <Grid container spacing={2} justifyContent="space-between" alignItems="center" flex="coloum" className='mt-[4px]'>
      <Grid item xs={3}>
        <div>Latitude*</div>
        <OutlinedInput
          fullWidth
          size="small"
          className="outline-none"
          value={latlngDetails.value.location?.coordinates?.[1] || ''}
          onChange={(e) => handleOnChange(e, 'latitude')}
        />
        {(latlngDetails.value.location?.coordinates?.[1] === undefined || Number.isNaN(latlngDetails.value.location?.coordinates?.[1])) && (
          <FormHelperText className='text-[#FF853E]'>Latitude is required</FormHelperText>
        )}
      </Grid>
      <Grid item xs={3}>
        <div>Longitude*</div>
        <OutlinedInput
          fullWidth
          size="small"
          className="outline-none"
          value={latlngDetails.value.location?.coordinates?.[0] || ''}
          onChange={(e) => handleOnChange(e, 'longitude')}
        />
        {(latlngDetails.value.location?.coordinates?.[0] === undefined || Number.isNaN(latlngDetails.value.location?.coordinates?.[0])) && (
          <FormHelperText className='text-[#FF853E]'>Longitude is required</FormHelperText>
        )}
      </Grid>
      <Grid item xs={2} className='mt-[16px]'>
        <div>Measurement System*</div>
      </Grid>
      <Grid item xs={4} className='mt-[16px]'>
        <RadioGroup row value={latlngDetails.value.measurement || "US"}  onChange={handleMeasurementChange} >
          <FormControlLabel value="US" control={<Radio />} label="US (ft,pound)" />
          <FormControlLabel value="metric" control={<Radio />} label="Metric System (m,kg)" />
        </RadioGroup> 
        {(latlngDetails.value.measurement === undefined) && (
          <FormHelperText className='text-[#FF853E]'>Measurement is required</FormHelperText>
        )}
      </Grid>
    </Grid>
  );
};

export default ProjectLatLngDetails;