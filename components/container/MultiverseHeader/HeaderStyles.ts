import { styled } from '@mui/system';
import { Theme } from '../../../styles/globalStyles';
import Image from 'next/image';

export const HeaderContainer = styled('div')({
  minHeight: '60px',
  boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const HeaderLeftPart = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export const HeaderLogoImageContainer = styled('div')({
  padding: '0px 0px 0px 15px',
  
  width:'175px',
  cursor: 'pointer',
});

export const HeaderRightPart = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
});

export const HeaderToggle = styled('div')({
  display: 'flex',
  //boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.2)',
  marginRight: '15px',
  //borderRadius: '4px',
  //border: '1px solid #F1742E',
});

export const HeaderToggleButtonOne = styled('button')((props: any) => ({
  background: !props?.toggleStatus ? props.isAvailable?'none':'#E7E7E7' : '#F1742E',
  border: !props?.toggleStatus ? `1px solid #F1742E` : "none",
  borderRadius: (props?.dataTestid==="design-button")?"4px 0px 0px 4px":"0px 4px 4px 0px",
  cursor: 'pointer',
  color: !props?.toggleStatus ? props.isAvailable?'#36415D':'#D3D3D3' :'#FFFFFF',
  padding: '6px 10px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
})) as any;

export const HeaderProfileImageContainer = styled('div')({
  marginRight: '10px',
  cursor: 'pointer',
  borderRadius: '50%' ,
  // padding:'4px',
  // '&:hover': {
  //   background: '#EEEEEE'
  // },
  // border: "1.5px solid #36415D",
  // borderRadius: "50%",
  // boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
});

export const ProfileImgIcon = styled(Image)({
  cursor: 'pointer',
  borderRadius: '50%',
  border: '1.5px solid #36415D',
  height: '34px',
  // boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
});

export const ProfileImgIconDefault = styled(Image)({
  cursor: 'pointer',
  borderRadius: '50%',
  // border: '1.5px solid #36415D',
  height: '34px',
  // boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
});

export const ProfileImgSecIcon = styled(Image)({
  cursor: 'pointer',
  borderRadius: '100%',
  border: '1.5px solid #36415D',
  height: '34px',
  marginLeft: 'auto',
  // boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
});

export const HeaderMenuImageContainer = styled('div')({
  marginRight: '10px',
  cursor: 'pointer',
  borderRadius: '50%' ,
});
export const HeaderSupportImageContainer = styled('div')({
  
  cursor: 'pointer',
  borderRadius: '50%' ,
});

export const HeaderNotificationImageContainer = styled('div')({
  marginRight: '10px',
  cursor: 'pointer',
  borderRadius: '50%' ,
 

});
export const HeaderUploaderImageContainer = styled('div')({
  marginRight: '10px',
  cursor: 'pointer',
  borderRadius: '50%' ,
 

});


export const ProjectSelectorContainer= styled('div')({
  marginRight: '15px',
  cursor: 'pointer',
  borderRadius: '28' ,
  '&:hover': {
    background: '#EEEEEE'
  },
});