"use client"
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { RxCross2 } from "react-icons/rx";

const UploadProductImg = ({ formData, setFormData, errors, setErrors, onChange }) => {
  const MAX_IMAGES = 20;
  const [previews, setPreviews] = useState(formData.product_img || []);

  const onDrop = (acceptedFiles) => {
    if (previews.length + acceptedFiles.length > MAX_IMAGES) {
      alert(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const newPreviews = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file), isExisting: false })
    );
    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);
    setFormData((prev) => ({
      ...prev,
      product_img: updatedPreviews,
    }));
  };

  const removeImage = (index) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    setFormData((prev) => ({
      ...prev,
      product_img: updatedPreviews,
    }));
  };
 
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full border-dashed border-1 p-4 mx-auto rounded-lg">
        {errors.product_img && <p className="text-red-500 text-sm">{errors.product_img}</p>}
        <div className="flex flex-col">
          <h2 className="text-base font-bold dark:text-gray-200 text-gray-800">Foto</h2>
          <small className="dark:text-gray-300 text-gray-600 text-1">
            Ngarko foto me rezolucion të lartë
          </small>
        </div>

        <div className="mt-4 grid grid-cols-6 sm:grid-cols-5 xsm:grid-cols-3 xxsm:grid-cols-1 lg:grid-cols-7 gap-4">
          {previews.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={file.preview}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white xsm:w-4 xsm:h-4 md:w-6 md:h-6 flex items-center justify-center rounded-full opacity-100 transition"
              >
                <RxCross2 />
              </button>
            </div>
          ))}
        </div>

        <p className="text-gray-800 dark:text-gray-200 mb-2 text-right">
          Uploaded {previews.length}/{MAX_IMAGES} images
        </p>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the images here...</p>
          ) : (
            <p className="text-gray-500">
              Drag and drop images here, or click to select files
            </p>
          )}
        </div>
      </div>
     
    </div>
  );
};

export default UploadProductImg;
