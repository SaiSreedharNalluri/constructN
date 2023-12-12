import React from 'react';
import { Grid, OutlinedInput } from '@mui/material';
import ProjectImageUpload from './projectImageUpload';
const ProjectAddress = () => {
  return (
    <Grid container spacing={2} className='mt-[2px]' justifyContent="space-between">
    <Grid item xs={3}>
      <div>
        Address
      </div>
      <OutlinedInput
        fullWidth
        size="small"
        className="outline-none"
        multiline
        rows={4.3}
      />
    </Grid>
    <Grid item xs={5}>
      <Grid container spacing={1.5}>
        <Grid item xs={6}>
          <div>
            Country*
          </div>
          <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
          />
        </Grid>
        <Grid item xs={6}>
          <div>
            State*
          </div>
          <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
          />
        </Grid>
        {/* City */}
        <Grid item xs={6}>
          <div>
            City*
          </div>
          <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
          />
        </Grid>
        <Grid item xs={6}>
          <div>
            Zipcode*
          </div>
          <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
          />
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={4} style={{ display: 'flex', alignItems: 'stretch' }}>
 <ProjectImageUpload></ProjectImageUpload>
    </Grid>

  </Grid>
  );
};

export default ProjectAddress;
