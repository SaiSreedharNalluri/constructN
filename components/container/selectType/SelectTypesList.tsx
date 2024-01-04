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
  optionsList = [],
  onSelect,
  initData
}: any) => {
 
  
  const [searchTerm, setSearchTerm] = useState("");
  // const [list, setList] = useState(optionsList);
  const [types,setTypes] = useState<any>(undefined)
  const [filteredItems, setFilteredItems] = useState<any>(optionsList);
  // console.log("type bar values",types);
 
  
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
    const searchFieldString = event.target.value.toLocaleLowerCase();
    console.log("search",searchFieldString);
    let newObj = types?.filter((val: any) => 
      val.toLocaleLowerCase().includes(searchFieldString)
    );
    setFilteredItems(newObj);
  };
  // useEffect(() => {
  //   setTypes(initData?.currentTypesList);
  // }, [initData?.currentTypesList]);

useEffect(()=>{
  let types = initData
  let result = types?.currentViewTypeList.map((item:any,index:number)=>{
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
setFilteredItems(result)
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
          {filteredItems?.length >0 && 
           filteredItems?.map((item: any, index: number) => (
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
                {index !== types?.length - 1 && <Divider></Divider>}
              </>
            ))}
        </ListStyled>
      </DrawerBox>
    </SelectLayerContainer>
  );
};

export default SelectTypesList;
