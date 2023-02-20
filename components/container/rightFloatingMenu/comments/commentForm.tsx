import React, { useState } from 'react';

interface IProps {
  handleSubmit: (text: string) => void;
  submitLabel: string;
  hasCancelButton?: boolean;
  handleCancel: () => void;
  initialText?: string;
}

const CommentForm: React.FC<IProps> = ({
  handleSubmit,
  submitLabel,
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
      <textarea
        className="w-full h-3/4"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="px-2 py-1  focus:outline-none bg-blue-500 hover:bg-gray-800 rounded text-gray-200 font-semibold"
        type="submit"
        disabled={isTextareaDisabled}
      >
        {submitLabel}
      </button>
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
