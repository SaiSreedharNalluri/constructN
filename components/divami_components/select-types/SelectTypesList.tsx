import SearchIcon from "@mui/icons-material/Search";
import { Divider, InputAdornment, ListItemText } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import { SelectLayerContainer } from "../select-layers/StyledComponents";
import { SelectLayerProps } from "../select-layers/Type";
import {
  CloseIconStyled,
  CustomSearchField,
  DrawerBox,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerSearchBar,
  ListItemStyled,
  ListStyled,
} from "./StyledComponents";
import Image from "next/image";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";

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
      console.log(searchedList);
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
                  <Image src={SearchBoxIcon} alt="" />
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
