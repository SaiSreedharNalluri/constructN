import { faPaperPlane, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

interface IProps {
  handleSubmit: (text: string) => void;
  hasCancelButton?: boolean;
  handleCancel: () => void;
  initialText?: string;
}

const CommentForm: React.FC<IProps> = ({
  handleSubmit,
  hasCancelButton = false,
  handleCancel,
  initialText = '',
}) => {
  const [text, setText] = useState<string>(initialText);
  const isTextareaDisabled = text.length === 0;
  const onSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(text);
    setText('');
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-9 p-2">
        <textarea
          className="resize-none  rounded-full h-6 col-span-7"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          //className="rounded-full"
          type="submit"
          disabled={isTextareaDisabled}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="rounded-full cursor-pointer p-2 bg-gray-300 justify-between"
          ></FontAwesomeIcon>
        </button>
      
      {hasCancelButton && (
        <button
        className=''
          type="button"
        >
          {/* Cancel */}
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="rounded-full bg-gray-300 justify-between p-2"
            onClick={handleCancel}
          ></FontAwesomeIcon>
        </button>
        
      )}
      </div>
    </form>
  );
};
export default CommentForm;
