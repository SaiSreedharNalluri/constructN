import { styled } from '@mui/system';
import { Theme } from '../../../styles/globalStyles';
import Image from 'next/image';
import { Box, TextField } from '@mui/material';

export const TaskListContainer = styled('div')({
  width: '438px',
  height: '100%',
});

export const HeaderContainer = styled('div')({
  backgroundColor: 'white',
  height: '51px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  borderBottom: '1px solid #d9d9d9',
});

export const TitleContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: '20px',
  paddingRight: '20px',
});

export const CloseIcon = styled(Image)({
  cursor: 'pointer',
});

export const MiniHeaderContainer = styled(Box)({
  backgroundColor: 'white',
  height: '51px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
});

// border-bottom: 1px solid #d9d9d9;

export const MiniSymbolsContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingLeft: '20px',
  paddingRight: '20px',
});

export const SearchGlassIcon = styled(Image)({
  cursor: 'pointer',
});

export const DividerIcon = styled(Image)({
  cursor: 'pointer',
  marginLeft: '21px',
});

export const ArrowUpIcon = styled(Image)({
  cursor: 'pointer',
  marginLeft: '27px',
});

export const DownloadIcon = styled(Image)({
  cursor: 'pointer',
  marginLeft: '12px',
});

export const FunnelIcon = styled(Image)({
  cursor: 'pointer',
  marginLeft: '12px',
});

export const DueDate = styled(Box)({
  marginLeft: '14px',
});

export const BodyContainer = styled(Box)`
  padding-left: 20px;
  padding-right: 20px;
  overflow: auto;
`;

export const FirstHeader = styled('div')({
  display: 'flex',
});

export const BodyInfo = styled('div')({
  cursor: 'pointer',
});

export const BodyContTitle = styled('div')({
  marginLeft: '10px',
});

export const SecondHeader = styled('div')({
  marginLeft: '35px',
});

export const ThirdHeader = styled('div')({
  display: 'flex',
  marginLeft: '35px',
  marginTop: '6px',
  justifyContent: 'space-between',
});

export const DueDateDiv = styled('div')({
  fontFamily: '"Open Sans"',
  fontStyle: 'italic',
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '19px',
  color: '#787878',
});

export const ArrowDownIcon = styled(Image)({
  cursor: 'pointer',
  marginLeft: '27px',
});

export const HorizontalLine = styled('div')({
  backgroundColor: '#d9d9d9',
  borderBottom: '1px solid #d9d9d9',
  width: '398x',
  marginTop: '18px',
  marginBottom: '20px',
});

export const LoadMoreContainer = styled('div')({
  border: '1px solid #d9d9d9',
  display: 'flex',
});

export const LoadMoreButton = styled('div')({
  border: '1px solid red',
});

export const ArrowUpContainer = styled('div')({
  border: '1px solid red',
  marginLeft: '10px',
});

export const CustomSearchField = styled(TextField)({
  width: '100%',
  '&:focus-within fieldset': {
    border: '1px solid #36415d !important',
  },
  '&:focus-visible fieldset': {
    border: '1px solid #36415d !important',
  },
  '& .MuiOutlinedInput-root': {
    height: '40px',
    paddingLeft: '16px',
    paddingRight: '8px',
  },
});

export const SearchAreaContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  gap: '10px',
});
