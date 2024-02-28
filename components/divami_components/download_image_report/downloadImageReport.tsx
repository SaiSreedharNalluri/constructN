import { Button, Menu, MenuItem, Typography } from "@mui/material"
import React from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Image from 'next/image'
import pngIcon from '../../../public/divami_icons/pngIcon.svg'
import pdfIcon from '../../../public/divami_icons/pdfIcon.svg'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
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
  <div className="absolute top-[11rem] right-0 pointer text-center">
  <Button
    className="bg-white w-[8.75rem] hover:bg-white "
    aria-controls={open ? 'basic-menu' : undefined}
    aria-haspopup="true"
    aria-expanded={open ? 'true' : undefined}
    onClick={handleMenuClick}
  >
    <FileDownloadIcon className='text-[#101F4C] opacity-[0.8] ml-1.5'/>
    <label className='text-[#101F4C] opacity-[0.8]  text-[10px] text-center ml-1.5 font-sans'>
      Download
    </label>
    {open ? <KeyboardArrowUpIcon className="text-[#101F4C] opacity-[0.8] mx-1.5" fontSize="medium"/> : <KeyboardArrowDownIcon className="text-[#101F4C] opacity-[0.8] mx-1.5 " fontSize="medium"/>}
  </Button>
  <Menu
    id="basic-menu"
    anchorEl={anchorEl}
    open={open}
    onClose={handleMenuClose}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    MenuListProps={{
      'aria-labelledby': 'basic-button',
      style: {
        width: 'fit-content', 
      },
    }}
  >
    <MenuItem onClick={() => {
      download360Image();
      handleMenuClose();
    }}>
      <Image src={pngIcon} alt={""} className="w-[0.75rem] h-[1rem]" />
      <label className='text-[#101F4C] opacity-[0.8] text-[10px] text-center ml-3 font-sans'>
      360 Image
      </label>
    </MenuItem>
    <MenuItem onClick={() => {
      downloadPdfReport();
      handleMenuClose();
    }}>
       <Image src={pdfIcon} alt={""} className="w-[0.75rem] h-[1rem]" />
      <label className='text-[#101F4C] opacity-[0.8] text-[10px] text-center ml-3 font-sans'>
        PDF Report
      </label>
    </MenuItem>
  </Menu>
</div>
</React.Fragment>)

}

export default DownloadImageReport