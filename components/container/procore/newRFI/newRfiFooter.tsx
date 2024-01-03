import { styled } from "@mui/system";
import { Box } from "@mui/material";
import CustomButton from "../../../divami_components/custom-button/CustomButton";
const ButtonsContainer = styled(Box)({
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });

const NewRfiFooter = () =>{
    return(<>
     <ButtonsContainer>
      <CustomButton type="outlined" label="Cancel" />
      <CustomButton
      type="contained"
        label="Create and Link"
       
      />
    </ButtonsContainer>
    </>)
}
export default NewRfiFooter;