import * as React from "react";
import plusIconTable from "../../../../public/divami_icons/plusIconTable.png";
import minusIconTable from "../../../../public/divami_icons/minusIconTable.svg";

import Image from "next/image";
import styled from "@emotion/styled";

const PenIconImage = styled(Image)`
  cursor: pointer;
`;
const TestIcon = (props: any) => {
  const [expand, setExpand] = React.useState(false);
  console.log("karan", props);
  const handleClick = () => {
    setExpand(!expand);
  };

  return (
    <button>
  <span></span>
  <span></span>
</button>
    // <div
    //   onClick={() => handleClick()}
    //   style={{
    //     transform: "180deg !important",
    //     transition: "",
    //     background: "none !important",
    //   }}
    // >
    //   {expand ? (
    //     <PenIconImage src={minusIconTable} alt="h" />
    //   ) : (
    //     <PenIconImage src={plusIconTable} alt="h" />
    //   )}
    // </div>
  );
};
export default TestIcon;
