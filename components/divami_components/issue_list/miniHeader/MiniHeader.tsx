
import Image from 'next/image'


import { Box, styled } from "@mui/system";
import searchGlassIcon from '../../../../public/divami_icons/searchGlassIcon.svg'
import dividerIcon from '../../../../public/divami_icons/dividerIcon.svg'
import arrowUp from '../../../../public/divami_icons/arrowUp.svg'
import downloadIcon from '../../../../public/divami_icons/downloadIcon.svg'
import filterFunnelIcon from '../../../../public/divami_icons/filterFunnelIcon.svg'







const MiniHeaderContainer = styled(Box)`
  background-color: white;
  height: 51px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  // border-bottom: 1px solid #d9d9d9;
`

const MiniSymbolsContainer = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`

const SearchGlassIcon = styled(Image)`
  cursor: pointer;
`

const DividerIcon = styled(Image)`
  cursor: pointer;
  margin-left: 21px;
`

const ArrowUpIcon = styled(Image)`
  cursor: pointer;
  margin-left: 27px;
`
const DownloadIcon = styled(Image)`
  cursor: pointer;
  margin-left: 12px;
`
const FunnelIcon = styled(Image)`
  cursor: pointer;
  margin-left: 12px;
`

const DueDate = styled(Box)`
  margin-left: 14px;
`
const MiniHeaderComponent = () => {
  return (
    <MiniHeaderContainer>
      <MiniSymbolsContainer>
        {/* <Image src={searchGlassIcon} alt="Arrow" /> */}
        <SearchGlassIcon src={searchGlassIcon} alt={"close icon"} />
        <DividerIcon src={dividerIcon} alt={"close icon"} />

        {/* <Image src={dividerIcon} alt="Arrow" /> */}
        <ArrowUpIcon src={arrowUp} alt="Arrow" />

        <DueDate>Due Date</DueDate>
        <DownloadIcon src={downloadIcon} alt="Arrow" />

        <FunnelIcon src={filterFunnelIcon} alt="Arrow" />
      </MiniSymbolsContainer>
    </MiniHeaderContainer>
  );
};

export default MiniHeaderComponent;
