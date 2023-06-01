import { Send } from "@mui/icons-material";
import { useState } from "react";
import { ImageErrorIcon } from "../hotspot-listing/HotspotListStyles";
import {
  AddCommentContainerSecond,
  StyledInput,
  AddCommentButtonContainer,
  SendButton,
} from "../task_detail/TaskDetailStyles";

export const EnterComments = ({
  replyToText,
  autofocusState,
  submitFn,
}: any) => {
  const [inputVal, setInputVal] = useState("");

  return (
    <AddCommentContainerSecond>
      <StyledInput
        id="standard-basic"
        variant="standard"
        placeholder={replyToText ? "Add Reply" : "Add Comment"}
        value={inputVal}
        // autoFocus={true}
        inputRef={(input) => {
          if (autofocusState) {
            input && input.focus();
          }
        }}
        onChange={(e) => {
          setInputVal(e.target?.value);
        }}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            submitFn(inputVal);
          } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.stopPropagation();
          }
        }}
      />
      <AddCommentButtonContainer>
        <SendButton
          onClick={() => {
            submitFn(inputVal);
          }}
        >
          <ImageErrorIcon src={Send} alt="" />
        </SendButton>
      </AddCommentButtonContainer>
    </AddCommentContainerSecond>
  );
};
