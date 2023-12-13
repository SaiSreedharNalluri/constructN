import React from 'react'
import { Grid, OutlinedInput} from '@mui/material';

const ProjectNameDetails = () => {
  return (
  
        <Grid container spacing={2} justifyContent="space-between" className='mt-[4px] ' >
        <Grid item xs={6} >
            <div>
                Project Name*
            </div>
            <OutlinedInput
                fullWidth
                size="small"
                className="outline-none"
                
              />
            </Grid>
            <Grid item xs={6} >
            <div>
                Project NickName
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

export default ProjectNameDetails