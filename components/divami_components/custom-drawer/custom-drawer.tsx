import Drawer from '@mui/material/Drawer'
import { useState } from 'react'
import { styled } from "@mui/system";


const StyledDrawer = styled(Drawer)`
  & .MuiPaper-root {
    width: 438px;
  }
`

const CustomDrawer = () => {

  return (
    <div>
      <StyledDrawer
        anchor={'right'}
        // open={openDrawer}
        // onClose={() => setOpenDrawer((prev) => !prev)}
      >
        {/* {props.children} */}
        listing of
      </StyledDrawer>
    </div>
  )
}

export default CustomDrawer
