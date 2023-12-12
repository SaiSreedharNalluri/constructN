import React from 'react'
import { Grid, OutlinedInput } from '@mui/material';
const ProjectTypeDetails = () => {
  return (
    <Grid container spacing={2} justifyContent="space-between" className='mt-[4px]' >
    <Grid item xs={3} >
        <div>
            Project ID
        </div>
        <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
          />
        </Grid>
        <Grid item xs={3} >
        <div>
            Project Type*
        </div>
        <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
            type='number'
          />
        </Grid>
        <Grid item xs={6} >
        <div>
        How do you intend to leverage ConstuctN for this project?
        </div>
        <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
          />
        </Grid>
    </Grid>
  )
}

export default ProjectTypeDetails