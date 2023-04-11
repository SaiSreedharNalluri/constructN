import styled from "@emotion/styled";
import React, { useRef } from "react";

const UploadImage = () => (
  <svg
    width="23"
    height="36"
    viewBox="0 0 23 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.1181 1H0.548828V28.2H7.31806M16.1181 1L22.2104 7.12M16.1181 1V7.12H22.2104M22.2104 7.12V28.2H15.4411"
      stroke="#36415D"
      stroke-linecap="round"
    />
    <path d="M11.377 35.0001V14.6001" stroke="#36415D" stroke-linecap="round" />
    <path
      d="M5.57617 20.4287L11.3784 14.6001L17.1806 20.4287"
      stroke="#36415D"
      stroke-linecap="round"
    />
  </svg>
);

const FileUploadContainer = styled.div`
  width: 398px;
  height: 128px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dotted #f1742e;
  border-radius: 6px;
  gap: 10px;
`;

const UploadLabelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
}
`;

const HiddenInputField = styled.input`
  display: none;
`;

const LabelArea = styled.div`
  width: 160px;
`;

const RedLabel = styled.span`
  color: rgba(241, 116, 46, 1);
`;

const GreyLabel = styled.span`
  color: grey;
`;
const CustomFileInput = ({ handleFileUpload, data, dataTestId }: any) => {
  const inputRef = useRef<any>(null);
  const handleFileChange = (event: any) => {
    handleFileUpload(event);
  };

  const handleClick = () => {
    if (inputRef?.current) {
      inputRef.current?.click();
    }
  };

  return (
    <>
      <FileUploadContainer
        onClick={handleClick}
        data-testid={"file-upload-container"}
      >
        <UploadImage />
        <UploadLabelContainer>
          <LabelArea>
            <RedLabel>Click Here &nbsp;</RedLabel>
            <GreyLabel>to browse from local system.</GreyLabel>
          </LabelArea>
          <HiddenInputField
            type="file"
            multiple
            onChange={handleFileChange}
            ref={inputRef}
            value={data.defaultValue}
            data-testid={dataTestId}
          />
        </UploadLabelContainer>
      </FileUploadContainer>
    </>
  );
};

export default CustomFileInput;
