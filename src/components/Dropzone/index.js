import React from "react";
import DropzoneComponent from "react-dropzone-uploader";
export default function Dropzone({ onChangeStatus, onSubmit }) {
  return (
    <DropzoneComponent
      getUploadParams={null}
      onChangeStatus={onChangeStatus}
      onSubmit={onSubmit}
      maxFiles={1}
      multiple={false}
      canCancel={false}
      styles={{
        textAlign: "center",
        dropzoneActive: { borderColor: "green" },
      }}
      SubmitButtonComponent={null}
      inputContent={
        <img src="/upload.png" className="img__uploader" alt="upload" />
      }
      accept="image/*"
    />
  );
}