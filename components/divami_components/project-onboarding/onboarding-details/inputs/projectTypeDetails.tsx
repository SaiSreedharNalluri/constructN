import React, { ChangeEvent } from 'react';
import { FormHelperText, Grid, MenuItem, OutlinedInput, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import { computed, useComputed, useSignal, useSignalEffect } from '@preact/signals-react';
import PopupComponent from '../../../../popupComponent/PopupComponent';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import router from "next/router";
const ProjectTypeDetails = ({
  type, isTypeValid, saveState
}: any) => {

  useSignalEffect(() => {
    isTypeValid.value = (type.value.type !== undefined && type.value.type !== '')
  })

  const handleOnChange = (event: ChangeEvent<{ name?: string; value: unknown }> | SelectChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target
    type.value = { ...type.value, [name as string]: value }
    if(saveState) saveState.value = true
  }

  const showPopUp = useSignal(false)

  const renderPopup = useComputed(() => showPopUp.value === true ? <PopupComponent
    isUploader={false}
    hideCloseButton={true}
    open={showPopUp.value}
    setShowPopUp={(state: boolean) => {
      showPopUp.value = state
      type.value = {
        ...type.value,
        metaDetails: {
          ...type.value.metaDetails,
          projectIntend: 'Visual Documentation',
        },
      };
    }}
    modalTitle={"Attention"}
    modalmessage={"Please contact support@constructn.ai for this option. Do you want to continue with only 'Visual Documentation'?"}
    primaryButtonLabel={"Contact Support"}
    SecondaryButtonlabel={"Visual Documentation"}
    callBackvalue={() => {
      showPopUp.value = false
      // router.push("/projects")
      window.location.href = 'mailto:support@constructn.ai'
    }}
  /> : <></>)

  const renderContent = useComputed(() => <Grid container spacing={2} justifyContent="space-between" className='mt-[4px]'>
    <Grid item xs={3}>
      <div>Project ID</div>
      <OutlinedInput
        fullWidth
        size="small"
        className="outline-none"
        name='projectId'
        value={type.value.metaDetails?.projectId}
        endAdornment={<Tooltip title='This is your internal project ID for easy discovery on ConstructN'>
          <InfoOutlinedIcon htmlColor='#7a7a7a' fontSize='small' className='cursor-pointer' />
        </Tooltip>}
        onChange={(e) => handleProjectIntend('projectId', e.target.value)}
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
        <MenuItem value="Other">Other</MenuItem>
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
        onChange={(e) => handleProjectIntend('projectIntend', e.target.value)} >
        <MenuItem value="Visual Documentation">Visual Documentation</MenuItem>
        <MenuItem value="Progress Monitoring">Progress Monitoring</MenuItem>
        <MenuItem value="Both">Both</MenuItem>
      </Select>
    </Grid>
    {renderPopup}
  </Grid>)

  const handleProjectIntend = (field: string, value: string) => {
    if (value === 'Both' || value === 'Progress Monitoring') {
      showPopUp.value = true
    }
    type.value = {
      ...type.value,
      metaDetails: {
        ...type.value.metaDetails,
        [field]: value,
      },
    };
  }

  return (
    <>{renderContent}</>
  );
};

export default ProjectTypeDetails;