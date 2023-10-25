import React, { useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import UploaderDateDetails from "../../../../components/divami_components/uploader_details/uploaderDetails";
import UploaderFiles from "../../../../components/divami_components/uploader_details/uploaderFiles";
import UploaderStepper from "../../../../components/divami_components/uploader_details/uploaderStepper";
import UploaderFooter from "../../../../components/divami_components/uploader_details/uploaderFooter"; 

interface IProps {}

const Index: React.FC<IProps> = () => {
  const [activeStep, setActiveStep] = useState(1);
  const steps = [
    "Details",
    "Choose Files",
    "Choose GCPs",
    "Review",
    "Upload",
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderCenterContent = () => {
    switch (activeStep) {
        case 0:
          return <UploaderDateDetails/>;
        case 1:
          return <UploaderFiles/>;
        case 2:
          return ;
        case 3:
          return ;
        case 4:
          return ;
        default:
          return null;
      }
  };

  return (
    <div>
      <div>
        <Header showBreadcrumbs breadCrumbData={[]} showFirstElement={true}></Header>
      </div>
      <div className="flex w-full fixed">
        <div>
          <SidePanelMenu onChangeData={() => {}}></SidePanelMenu>
        </div>
        <div className="calc-w calc-h mx-2 p-4 overflow-y-auto flex-1">
          <UploaderStepper activeStep={activeStep} steps={steps} /> 
         
          <div className="flex-1">{renderCenterContent()}</div>
        </div>

        <UploaderFooter
          activeStep={activeStep}
          steps={steps}
          handleNext={handleNext}
          handleBack={handleBack}
        /> 
      </div>
    </div>
  );
};

export default Index;
