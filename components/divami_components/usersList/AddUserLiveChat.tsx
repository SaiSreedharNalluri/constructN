import { OverlayTitle } from "../overlay-title/OverlayTitle";
import {
  ChatHeaderContainer,
  ChatContentContainer,
  EnterComments,
} from "./AddUserLiveChatStyles";
import manageUserIcon from "../../../public/divami_icons/manageUserIcon.svg";

export const AddUserLiveChat = ({ closeOverlay, userData }: any) => {
  return (
    <>
      <OverlayTitle
        title={userData.name}
        userRole={userData.role}
        handleClose={closeOverlay}
        userIcon={manageUserIcon}
      />
      <ChatContentContainer></ChatContentContainer>
      <EnterComments></EnterComments>
    </>
  );
};
