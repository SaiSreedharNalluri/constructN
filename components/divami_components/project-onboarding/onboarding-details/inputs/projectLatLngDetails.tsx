import React from 'react'
import { Grid, OutlinedInput, FormControlLabel, Radio, RadioGroup } from '@mui/material';
const ProjectLatLngDetails = () => {
  return (
    <Grid container spacing={2} justifyContent="space-between" alignItems="center" flex="coloum" className='mt-[4px]' >
    <Grid item xs={3} >
        <div>
            Latitude*
        </div>
        <OutlinedInput
            fullWidth
            size="small"
            className="outline-none" 
          />
        </Grid>
        <Grid item xs={3} >
        <div>
            Longitude*
        </div>
        <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"          
          />
        </Grid>
        <Grid item xs={2} className='mt-[16px]'>
        <div>
        Measurement System*
        </div>
        </Grid>
        <Grid item xs={4} className='mt-[16px]'>

        <RadioGroup
                row
              >
                <FormControlLabel
                  value="us"
                  control={<Radio  />}
                  label="US"
                />
                <FormControlLabel
                  value="metric"
                  control={<Radio  />}
                  label="Metric"
                />
              </RadioGroup>
</Grid>
    </Grid>
  )
}

export default ProjectLatLngDetails