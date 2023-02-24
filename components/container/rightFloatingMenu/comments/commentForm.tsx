import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
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
      <div className="grid grid-cols-8 p-2">
        <textarea
          className=" col-span-7"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="focus:outline-none bg-gray-600 hover:bg-gray-800 rounded text-gray-200 font-semibold"
          type="submit"
          disabled={isTextareaDisabled}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="rounded-full"
          ></FontAwesomeIcon>
        </button>
      </div>
      {hasCancelButton && (
        <button
          type="button"
          className="ml-2 px-2 py-1  focus:outline-none bg-gray-500 hover:bg-gray-800 rounded text-gray-200 font-semibold"
          onClick={handleCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
};
export default CommentForm;
