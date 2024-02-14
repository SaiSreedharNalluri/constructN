import { Button, Menu, MenuItem } from "@mui/material"
import React from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
interface IProps
{
    download360Image:() => void,
    downloadPdfReport:()=> void
}
const DownloadImageReport:React.FC<IProps> =({download360Image,downloadPdfReport}) =>{
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
    return(
    <React.Fragment>
  <div className="absolute top-[11rem] right-[1rem]">
            <Button
            className="bg-[#F1742E] text-white rounded-[4px] hover:bg-[#F1742E] "
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleMenuClick}
            >
              Download
              <KeyboardArrowDownIcon/>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={()=>{
                download360Image()
                handleMenuClose()
                }}>360 Image</MenuItem>
              <MenuItem onClick={()=>{
                downloadPdfReport()
                handleMenuClose()
                }}>PDF Report </MenuItem>
            </Menu>
          </div>
    </React.Fragment>)

}

export default DownloadImageReport