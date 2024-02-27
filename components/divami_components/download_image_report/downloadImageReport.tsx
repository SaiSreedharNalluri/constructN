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
  <div className="absolute top-[11rem] right-0">
  <Button
    className="bg-white w-[8.75rem] pointer font-['Open_Sans'] hover:bg-white"
    aria-controls={open ? 'basic-menu' : undefined}
    aria-haspopup="true"
    aria-expanded={open ? 'true' : undefined}
    onClick={handleMenuClick}
  >
    <label className='text-[#101F4C] opacity-[0.8] text-[10px] text-center'>
      Download
    </label>
    <KeyboardArrowDownIcon className="text-[#101F4C] opacity-[0.8] ml-2"/>
  </Button>
  <Menu
    id="basic-menu"
    anchorEl={anchorEl}
    open={open}
    onClose={handleMenuClose}
    MenuListProps={{
      'aria-labelledby': 'basic-button',
      style: {
        width: '8.75rem',
      },
    }}
  >
    <MenuItem onClick={() => {
      download360Image();
      handleMenuClose();
    }}>
      <label className='text-[#101F4C] opacity-[0.8] text-[10px] text-center'>
        360 Image
      </label>
    </MenuItem>
    <MenuItem onClick={() => {
      downloadPdfReport();
      handleMenuClose();
    }}>
      <label className='text-[#101F4C] opacity-[0.8] text-[10px] text-center'>
        PDF Report
      </label>
    </MenuItem>
  </Menu>
</div>
</React.Fragment>)

}

export default DownloadImageReport