import React, { ChangeEvent } from 'react';
import { FormHelperText, Grid, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { computed, useSignal } from '@preact/signals-react';
import { useProjectContext } from '../../../../../state/projectState/context';
import { IProjects } from '../../../../../models/IProjects';
const ProjectTypeDetails = ({
  type, isTypeValid
}: any) => {
  const isValid = computed(() => (
    (type.value.type !== undefined && type.value.type !== '')))
  isTypeValid.value = isValid.value

  const handleOnChange = (event: ChangeEvent<{ name?: string; value: unknown }> | SelectChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target
    type.value = { ...type.value, [name as string]: value }
  }

  const handleProjectIntend = (event: SelectChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target
    const metaDetails = {...type.value.metadetails, [name as string]: value}
    type.value = { ...type.value, metaDetails }
  }

  return (
    <Grid container spacing={2} justifyContent="space-between" className='mt-[4px]'>
      <Grid item xs={3}>
        <div>Project ID</div>
        <OutlinedInput
          fullWidth
          size="small"
          className="outline-none"
          name='projectID'
          value={type.value.projectID}
          onChange={
            handleOnChange}
        />
      </Grid>
      <Grid item xs={3}>
        <div>Project Type*</div>
        <Select
          fullWidth
          size="small"
          name='type'
          value={type.value.type || ""}
          onChange={handleOnChange} >
          <MenuItem value="Commercial">Commercial</MenuItem>
          <MenuItem value="Healthcare">Healthcare</MenuItem>
          <MenuItem value="Residential">Residential</MenuItem>
          <MenuItem value="Infrastructure">Infrastructure</MenuItem>
          <MenuItem value="Industrial">Industrial</MenuItem>
          <MenuItem value="Data Center">Data Center</MenuItem>
        </Select>
        {(type.value.type === undefined || type.value.type === "") && (
          <FormHelperText className='text-[#FF853E]'>Project type is required</FormHelperText>
        )}
      </Grid>
      <Grid item xs={6}>
        <div>How do you intend to leverage ConstructN for this project?</div>
        <Select
          fullWidth
          size="small"
          name='projectIntend'
          value={type.value.metaDetails?.projectIntend || ""}
          onChange={handleProjectIntend} >
          <MenuItem value="Visual Documentation">Visual Documentation</MenuItem>
          <MenuItem value="Progress Monitoring">Progress Monitoring</MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
};

export default ProjectTypeDetails;