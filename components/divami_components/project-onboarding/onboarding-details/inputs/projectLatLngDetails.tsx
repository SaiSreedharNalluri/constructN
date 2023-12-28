import React, { ChangeEvent } from 'react';
import { Grid, OutlinedInput, FormControlLabel, Radio, RadioGroup, FormHelperText } from '@mui/material';
import { computed, effect, useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import { validateLatitude, validateLongitude } from '../../../../../utils/utils';
const ProjectLatLngDetails = ({ latlngDetails, isLatLngValid }: any) => {
  
  useSignalEffect(() => {
    isLatLngValid.value = (
      latlngDetails.value.location?.coordinates?.[0] !== undefined && 
      !Number.isNaN(latlngDetails.value.location?.coordinates?.[0]) && 
      (latlngDetails.value.location?.coordinates?.[1] !== undefined && 
      !Number.isNaN(latlngDetails.value.location?.coordinates?.[1])) && 
      (latlngDetails.value.measurement !== undefined && latlngDetails.value.measurement !== ""))
  })

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
        type: "point",
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

  useSignalEffect(() => {
    setDefaultMeasurement();
  });

  console.log(latlngDetails.value.location)

  const renderContent = useComputed(() => <Grid container spacing={2} justifyContent="space-between" alignItems="center" flex="coloum" className='mt-[4px]'>
    <Grid item xs={3}>
      <div>Latitude*</div>
      <OutlinedInput
        fullWidth
        size="small"
        type='number'
        className="outline-none"
        inputProps={{ step: 0.1 }}
        value={latlngDetails.value.location?.coordinates?.[1] || ''}
        onChange={(e: any) => handleOnChange(e, 'latitude')}
      />
      {latlngDetails.value.location?.coordinates?.[1] === '' || validateLatitude(latlngDetails.value.location?.coordinates?.[1]) !== true && (
        <FormHelperText className='text-[#FF853E]'>Latitude must be in the range [-90, 90]</FormHelperText>
      )}
    </Grid>
    <Grid item xs={3}>
      <div>Longitude*</div>
      <OutlinedInput
        fullWidth
        size="small"
        type='number'
        className="outline-none"
        inputProps={{ step: 0.1 }}
        value={latlngDetails.value.location?.coordinates?.[0] || ''}
        onChange={(e: any) => handleOnChange(e, 'longitude')}
      />
      {latlngDetails.value.location?.coordinates?.[0] === '' || validateLongitude(latlngDetails.value.location?.coordinates?.[0]) !== true && (
        <FormHelperText className='text-[#FF853E]'>Longitude must be in the range [-180, 180]</FormHelperText>
      )}
    </Grid>
    <Grid item xs={4.5} className='flex flex-col mt-[0px]'>
      <div>Measurement System*</div>
      <RadioGroup row value={latlngDetails.value.measurement || "US"} onChange={handleMeasurementChange} >
        <FormControlLabel className='[&>span]:text-sm' value="US" control={<Radio size='small' />} label="US (ft,pound)" />
        <FormControlLabel className='[&>span]:text-sm' value="Metric" control={<Radio size='small' />} label="Metric System (m,kg)" />
      </RadioGroup>
      {(latlngDetails.value.measurement === undefined) && (
        <FormHelperText className='text-[#FF853E]'>Measurement is required</FormHelperText>
      )}
    </Grid>
    <Grid item xs={1} className='mt-[16px]'>

    </Grid>
  </Grid>)

  return (
    <>{renderContent}</>
  );
};

export default ProjectLatLngDetails;