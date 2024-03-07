import { Button, Menu, MenuItem } from "@mui/material"
import React from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Image from 'next/image'
import pngIcon from '../../../public/divami_icons/pngIcon.svg'
import pdfIcon from '../../../public/divami_icons/pdfIcon.svg'
import downloadIcon from '../../../public/divami_icons/downloadFileIcon.svg'
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
  <div className="pointer text-center py-[7px] border border-solid border-gray-300 border-r-0 ">
  <Button
    className="bg-white w-[1rem] hover:bg-white"
    aria-controls={open ? 'basic-menu' : undefined}
    aria-haspopup="true"
    aria-expanded={open ? 'true' : undefined}
    onClick={handleMenuClick}
  >
    <Image src={downloadIcon} alt={""} className=" w-[1rem] h-[1.2rem] ml-2"/>
  
    {open ? <KeyboardArrowUpIcon className="text-[#101F4C] opacity-[0.8] mx-1.25" fontSize="small"/> : <KeyboardArrowDownIcon className="text-[#101F4C] opacity-[0.8] mx-1.25 " fontSize="small"/>}
  </Button>
  <Menu
    id="basic-menu"
    className="my-2"
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
    }} className="h-[2.1rem] hover:bg-[#fff2eb]  hover:text-[#f1742e]">
      <label className='text-[#101F4C]  text-[14px] text-center ml-3 font-sans hover:text-[#f1742e] hover:cursor-pointer'>
      360 Image
      </label>
    </MenuItem>
    <MenuItem onClick={() => {
      downloadPdfReport();
      handleMenuClose();
    }} className="h-[2.1rem] hover:bg-[#fff2eb]">
       
      <label className='text-[#101F4C] text-[14px] text-center ml-3 font-sans hover:text-[#f1742e] hover:cursor-pointer'>
        PDF Report
      </label>
    </MenuItem>
  </Menu>
</div>
</React.Fragment>)

}

export default DownloadImageReport