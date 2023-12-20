import React from 'react';
import { Grid, OutlinedInput, FormHelperText } from '@mui/material';
import ProjectImageUpload from './projectImageUpload';
import { useProjectContext } from '../../../../../state/projectState/context';
const ProjectAddress = ({ handleAddressChange, errorMessage,projectImage, coverPhoto, onProjectImageChange, onCoverPhotoChange }:any) => {
  const { state, projectContextAction } =useProjectContext();
  
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
          onChange={(e) =>{ handleAddressChange("address", e.target.value,true)
        }}
        />
        {errorMessage['address.address'] && (
          <FormHelperText className='text-[#FF853E]'>{errorMessage['address.address']}</FormHelperText>
        )}
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
            value={state.newProjectDetails.address?.country || ""}
              onChange={(e) =>{ handleAddressChange("country", e.target.value,true)
        
            }}
            />
            {errorMessage['address.country'] && (
              <FormHelperText className='text-[#FF853E]'>{errorMessage['address.country']}</FormHelperText>
            )}
        </Grid>
        <Grid item xs={6}>
          <div>
            State*
          </div>
          <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
            value={state.newProjectDetails.address?.state || ""}
              onChange={(e) => {handleAddressChange('state', e.target.value,true)
            
            }}
            />
            {errorMessage['address.state'] && (
              <FormHelperText className='text-[#FF853E]'>{errorMessage['address.state']}</FormHelperText>
            )}
          </Grid>
        <Grid item xs={6}>
          <div>
            City*
          </div>
          <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
              value={state.newProjectDetails.address?.city || ""}
              onChange={(e) => handleAddressChange('city', e.target.value,true)}
            />
            {errorMessage['address.city'] && (
              <FormHelperText className='text-[#FF853E]'>{errorMessage['address.city']}</FormHelperText>
            )}
        </Grid>
        <Grid item xs={6}>
          <div>
            Zipcode*
          </div>
          <OutlinedInput
            fullWidth
            size="small"
            className="outline-none"
              value={state.newProjectDetails.address?.zipcode || ""}
              onChange={(e) => handleAddressChange('zipcode', e.target.value,true)}
            />
            {errorMessage['address.zipcode'] && (
              <FormHelperText className='text-[#FF853E]'>{errorMessage['address.zipcode']}</FormHelperText>
            )}
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={4} style={{ display: 'flex', alignItems: 'stretch' }}>
 <ProjectImageUpload  selectedprojectImage={projectImage}
        onprojectImageFileChange={onProjectImageChange}   selectedCoverFile={coverPhoto}
        onFileCoverPhotoChange={onCoverPhotoChange}></ProjectImageUpload>
    </Grid>

  </Grid>
  );
};

export default ProjectAddress;
