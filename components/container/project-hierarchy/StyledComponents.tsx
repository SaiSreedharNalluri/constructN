import styled from '@emotion/styled'
import { TreeItem, TreeView } from '@mui/lab'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import Image from 'next/image'
import type { SelectLayerContainerProps } from './Type'

export const TreeViewContainer = styled(Box)`
  width: 301px;
  margin-top: 28px;
`

export const StyledTreeView = styled(TreeView)`
  & .Mui-expanded{
    background-color: #F4F4F4;
    border-color: red;
  };
  & .MuiCollapse-root{
    margin-left: 0;
    padding-left: 25px;
  };
  & .MuiTreeItem-content{
    flex-direction: row-reverse;
    width: unset;
    padding: 0;
    padding-right: 20px;
    padding-left: 20px;
    & .MuiTreeItem-label{
      padding: 10px 0px 10px 0px ;
      font-size: 14px;
      line-height: 18px;
      border-bottom: 1px solid #E7E7E7;
    };
  };
  & .MuiTreeItem-iconContainer{
    // height: 18px;
    padding: 10px 0px 10px 0px;
    // border-bottom: 1px solid #E7E7E7;
  };
  & .MuiTreeItem-content.MuiTreeItem-content.Mui-selected{
    background-color: #F4F4F4;
  };
  & .MuiTreeView-root{
    & .MuiTreeItem-content{
      background-color: #ff0000;
    };
  };
  & ul{
    background-color: #F4F4F4;
    & .MuiTreeItem-label{
      border-bottom:0;
    };
    & .MuiTreeItem-content{
    border-left: 1px dotted #D9D9D9;
  }
  };
  & .MuiTreeItem-content:hover{
    background: none
  },
`

export const ProjectHierarchyContainer = styled(Box)<SelectLayerContainerProps>`
  display: ${(props) => (props.openSelectLayer ? null : 'none')};
  width: 301px;
  box-shadow: 5px 4px 8px rgba(200, 200, 200, 0.1);
`
export const StyledTreeItem = styled(TreeItem)`
  padding: 0;
`

export const HeaderLabelContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 22px 15px 19px;
`

export const SearchContainer = styled(Box)`
  width: 261px;
  height: 40px;
  outline: none;
  padding: 0 22px 0px 19px;
  margin-bottom: 2px;
`

export const HeaderLabel = styled(Typography)`
  font-size: 16px;
  font-weight: 400;
`
export const CloseIcon = styled(Image)`
  cursor: pointer;
`
