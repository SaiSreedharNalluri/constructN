import React, { useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import UploaderDateDetails from "../../../../components/divami_components/uploader_details/uploaderDetails";
import UploaderFiles from "../../../../components/divami_components/uploader_details/uploaderFiles";
import UploaderStepper from "../../../../components/divami_components/uploader_details/uploaderStepper";
import UploaderFooter from "../../../../components/divami_components/uploader_details/uploaderFooter"; 

interface IProps {}

const Index: React.FC<IProps> = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isDateSelected, setIsDateSelected] = useState(false);



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
  const onDateSelected = () => {
    setIsDateSelected(true);
  };

  const renderCenterContent = () => {
    switch (activeStep) {
        case 0:
          return  (
            <UploaderDateDetails
              onDateSelected={onDateSelected} // Pass the callback
            />
          );
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
        <div className="calc-w calc-h mx-2 p-1 overflow-y-auto flex-1">
          <UploaderStepper activeStep={activeStep} steps={steps} /> 
         
          <div className="flex-1 content-container max-h-[400px]">{renderCenterContent()}</div>
        </div>
        </div>
        {isDateSelected && (
            <div className="fixed m-4px  bg-transparent left-6 bottom-0 right-4  p-4 ">


          <UploaderFooter
           activeStep={activeStep}
           steps={steps}
           handleNext={handleNext}
           handleBack={handleBack}
           isDateSelected={isDateSelected}
        />
        </div>
        )} 
      </div>
  
  );
};

export default Index;
