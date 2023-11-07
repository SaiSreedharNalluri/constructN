import React, { useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import UploaderDateDetails from "../../../../components/divami_components/uploader_details/uploaderDetails";
import UploaderFiles from "../../../../components/divami_components/uploader_details/uploaderFiles";
import UploaderStepper from "../../../../components/divami_components/uploader_details/uploaderStepper";
import UploaderFooter from "../../../../components/divami_components/uploader_details/uploaderFooter"; 
import { UploaderContextProvider, useUploaderContext } from "../../../../state/uploaderState/context";
import { UploaderStep } from "../../../../state/uploaderState/state";
import UploaderFinal from "../../../../components/divami_components/uploader_details/uploaderFinal/uploaderFinal";

interface IProps {}

const Index: React.FC<IProps> = () => {
  const { state: uploaderState, uploaderContextAction } = useUploaderContext();
  const { uploaderAction } = uploaderContextAction;
  const [isDateSelected, setIsDateSelected] = useState(false);

  const onDateSelected = () => {
    setIsDateSelected(true);
  };

  const renderCenterContent = () => {
    switch (uploaderState.step) {
        case UploaderStep.Details:
          return  (
            <UploaderDateDetails
              onDateSelected={onDateSelected} // Pass the callback
            />
          );
        case UploaderStep.ChooseFiles:
          return <UploaderFiles/>;
        case UploaderStep.ChooseGCPs:
          return ;
        case UploaderStep.Review:
          return ;
        case UploaderStep.Upload:
          uploaderAction.setStepperSideFilesList(false)
          return (<UploaderFinal/>) ;
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
          {
            uploaderState.stepperSideFileList &&(<UploaderStepper />)
          }
          <div className="flex-1 content-container max-h-[400px]">{renderCenterContent()}</div>
        </div>
        </div>
        {uploaderState.date && (
            <div className="fixed m-4px  bg-transparent left-6 bottom-0 right-4  p-4 ">


          <UploaderFooter
           isDateSelected={isDateSelected}
        />
        </div>
        )} 
      </div>
  );
};

export default Index;
