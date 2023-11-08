import React, { useState } from "react";

const GcpManualFile: React.FC<any> = () => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [base64File, setBase64File] = useState<string | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      const selectedFile = fileInput.files[0];
      const allowedFormats = ["image/jpeg", "image/png"];

      if (allowedFormats.includes(selectedFile.type)) {
        setSelectedFileName(selectedFile.name);

        const reader = new FileReader();

        reader.onload = (e) => {
          
          const base64Data = e.target?.result;
          setBase64File(base64Data as string);
        };

        reader.readAsDataURL(selectedFile);
      } else {
        console.log("Please select a valid JPG or PNG file.");
      }
    }
  };

  return (
    <React.Fragment>
      <div>
        <p className="p-1 w-997px h-22px font-sans font-normal not-italic text-base line-height-150%">
          Give a brief description of your GCP and / or upload an image (optional)
        </p>
        <textarea
          className="border border-gray-300 p-1"
          style={{ width: '500px' }}
          placeholder="Enter text up to 120 characters"
        ></textarea>
        <div>
          <label
            htmlFor="fileInput"
            className="p-2 w-997px h-24px font-sans font-normal not-italic text-base line-height-150%"
          >
            Choose File
          </label>
          <input
            type="text"
            className="border border-gray-300 p-2"
            placeholder=".jpg or .png files only"
            style={{ width: '300px', height:"24px"}}
            value={selectedFileName || ""}
            readOnly
          />
          <label htmlFor="fileInput" className=" ml-2 border border-gray-300 bg-border-yellow rounded-md text-white p-1">
            Add File
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none',}}
              onChange={handleFileChange}
              accept=".jpg, .jpeg, .png"
            />
          </label>
        </div>
      </div>
    </React.Fragment>
  );
};

export default GcpManualFile;
