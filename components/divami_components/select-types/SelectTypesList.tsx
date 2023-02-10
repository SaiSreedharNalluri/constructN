import {
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { SetStateAction, useEffect } from "react";
import { useState } from "react";
import type { ISideDrawerProps } from "./types";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@emotion/styled";
import {
  DrawerBox,
  DrawerHeader,
  DrawerHeaderTitle,
  CloseIconStyled,
  DrawerSearchBar,
  CustomSearchField,
  ListStyled,
  ListItemStyled,
} from "./StyledComponents";
import { SelectLayerProps } from "../select-layers/Type";
import { SelectLayerContainer } from "../select-layers/StyledComponents";

const SelectTypesList = ({
  title,
  openselectlayer,
  onCloseHandler,
  optionsList = {},
  onSelect,
}: SelectLayerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [list, setList] = useState(optionsList);
  const mockSelectTypesData = [
    "Plan Drawings",
    "Cross Section Drawings",
    "Layout Drawings",
    "Site Plan Drawings",
    "Plan Drawings",
    "Cross Section Drawings",
    "Layout Drawings",
    "Site Plan Drawings",
  ];
  const handleSearch = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
    console.log();
    if (String(event.target.value)?.length) {
      const searchedList = Object.keys(optionsList).filter((item: any) =>
        item.toLowerCase().includes(String(event.target.value)?.toLowerCase())
      );
      setList(searchedList);
    } else {
      setList(Object.keys(optionsList));
    }
  };

  useEffect(() => {
    if (Object.keys(optionsList)?.length) {
      setList(Object.keys(optionsList));
    }
  }, [optionsList]);
  console.log(optionsList, "options", list);
  // const filteredItems = optionsList.filter((item:any) =>
  //   item.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <SelectLayerContainer openSelectLayer={openselectlayer}>
      <DrawerBox>
        <DrawerHeader>
          <DrawerHeaderTitle>{title}</DrawerHeaderTitle>
          <CloseIconStyled onClick={onCloseHandler} />
        </DrawerHeader>
        <DrawerSearchBar>
          <CustomSearchField
            placeholder="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            InputLabelProps={{ shrink: false }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </DrawerSearchBar>
        <ListStyled>
          {list?.length &&
            list.map((item: any, index: number) => (
              <>
                <ListItemStyled
                  key={item}
                  onClick={() => {
                    onSelect({ target: { value: item } });
                    onCloseHandler();
                  }}
                >
                  <ListItemText primary={item} />
                </ListItemStyled>
                <Divider></Divider>
              </>
            ))}
        </ListStyled>
      </DrawerBox>
    </SelectLayerContainer>
  );
};

export default SelectTypesList;
