import SearchIcon from "@mui/icons-material/Search";
import { Divider, InputAdornment, ListItemText } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import { SelectLayerContainer } from "../selectLayer/StyledComponents";
import { SelectLayerProps } from "../selectLayer/Type";
import closeIcon from "../../../public/divami_icons/closeIcon.svg";
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
import { CloseIcon } from "../selectLayer/StyledComponents";
import Image from "next/image";
import SearchBoxIcon from "../../../public/divami_icons/search.svg";
import { IGenData } from "../../../models/IGenData";

const SelectTypesList = ({
  title,
  openselectlayer,
  onCloseHandler,
  optionsList = {},
  onSelect,
  initData
}: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [list, setList] = useState(optionsList);
  const [types,setTypes] = useState([])
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
  // const handleSearch = (event: {
  //   target: { value: SetStateAction<string> };
  // }) => {
  //   setSearchTerm(event.target.value);
  //   console.log();
  //   if (String(event.target.value)?.length) {
  //     const searchedList = Object.keys(optionsList).filter((item: any) =>
  //       item.toLowerCase().includes(String(event.target.value)?.toLowerCase())
  //     );
  //     console.log(searchedList);
  //     setList(searchedList);
  //   } else {
  //     setList(Object.keys(optionsList));
  //   }
  // };

  const onSearchChange = (event: any) => {
    let parentList = [...list.currentViewTypeList];
    const searchFieldString = event.target.value.toLocaleLowerCase();
    // console.log("searchFieldString", searchFieldString);
    let newObj = parentList.filter((val: any) => {
      return val.toLocaleLowerCase().includes(searchFieldString);
    });
    // console.log("newobjj", newObj);
    setList([...newObj]);
  };
  useEffect(() => {
    
    if (Object.keys(optionsList)?.length) {
      setList(Object.keys(optionsList));
    }
    setList(optionsList);
  }, [optionsList]);

useEffect(()=>{
  let types = initData
  let result = types.currentViewTypeList.map((item:any,index:number)=>{
    if(item === "pointCloud"){
      return "Reality";
    }
    else if(item === "orthoPhoto"){
      return "Map"
    }
    else{
      return item;
    }
}
)
setTypes(result)
},[initData.currentViewTypeList])
  // const filteredItems = optionsList.filter((item:any) =>
  //   item.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <SelectLayerContainer openselectlayer={openselectlayer}>
      <DrawerBox>
        <DrawerHeader>
          <DrawerHeaderTitle>{title} </DrawerHeaderTitle>
          {/* <CloseIconStyled onClick={onCloseHandler} /> */}
          <CloseIcon
            src={closeIcon}
            onClick={onCloseHandler}
            alt={"close Icon"}
          />
        </DrawerHeader>
        <DrawerSearchBar>
          <CustomSearchField
            placeholder="Search"
            variant="outlined"
            // value={searchTerm}
            // onChange={handleSearch}
            onChange={(e: any) => {
              onSearchChange(e);
            }}
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
          {list.currentViewTypeList?.length > 0 &&
           types.map((item: any, index: number) => (
              <>
                <ListItemStyled
                  className="custom-list-styled"
                  key={item}
                  onClick={() => {
                    if(item === "Reality"){
                      item="pointCloud"
                    }
                    if(item === "Map"){
                      item="orthoPhoto"
                    }
                    onSelect({ target: { value: item } });
                    onCloseHandler();
                  }}  
                >
                  <ListItemText primary={item} />
                </ListItemStyled>
                {index !== list.length - 1 && <Divider></Divider>}
              </>
            ))}
        </ListStyled>
      </DrawerBox>
    </SelectLayerContainer>
  );
};

export default SelectTypesList;
