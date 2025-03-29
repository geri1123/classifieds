// import React, { useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { RxCross2 } from "react-icons/rx";

// const UploadProductImg = ({ formData, setFormData }) => {
//   const MAX_IMAGES = 20;
//   const [previews, setPreviews] = useState(formData.product_img || []);

//   const onDrop = (acceptedFiles) => {
//     if (previews.length + acceptedFiles.length > MAX_IMAGES) {
//       alert(`You can upload a maximum of ${MAX_IMAGES} images.`);
//       return;
//     }

//     const newPreviews = acceptedFiles.map((file) =>
//       Object.assign(file, { preview: URL.createObjectURL(file), isExisting: false })
//     );
//     const updatedPreviews = [...previews, ...newPreviews];
//     setPreviews(updatedPreviews);
//     setFormData((prev) => ({
//       ...prev,
//       product_img: updatedPreviews,
//     }));
//   };

//   const removeImage = (index) => {
//     const updatedPreviews = previews.filter((_, i) => i !== index);
//     setPreviews(updatedPreviews);
//     setFormData((prev) => ({
//       ...prev,
//       product_img: updatedPreviews,
//     }));
//   };
 
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//   return (
//     <div className="flex flex-col gap-3">
//       <div className="w-full border-dashed border-1 p-4 mx-auto rounded-lg">
//         <div className="flex flex-col">
//           <h2 className="text-base font-bold dark:text-gray-200 text-gray-800">Images</h2>
//           <small className="dark:text-gray-300 text-gray-600 text-1">
//            Upload images
//           </small>
//         </div>
//         {/* grid grid-cols-6 sm:grid-cols-5 xsm:grid-cols-3 xxsm:grid-cols-1 lg:grid-cols-7 */}
//         <div className=" gap-4 flex flex-wrap my-2">
//           {previews.map((file, index) => (
//             <div key={index} className="relative group">
//               <img
//                 src={file.preview}
//                 alt={`Preview ${index}`}
//                 className="md:w-30 md:h-30 w-20 h-20 object-cover rounded"
//               />
//               <button
//                 onClick={() => removeImage(index)}
//                 className="absolute top-1 right-1 bg-red-500 text-white xsm:w-4 xsm:h-4 md:w-6 md:h-6 flex items-center justify-center rounded-full opacity-100 transition"
//               >
//                 <RxCross2 />
//               </button>
//             </div>
//           ))}
//         </div>

//         <p className="text-gray-800 dark:text-gray-200 mb-2 text-right">
//           Uploaded {previews.length}/{MAX_IMAGES} images
//         </p>

//         <div
//           {...getRootProps()}
//           className={`border-2 border-dashed rounded-lg p-6 text-center ${
//             isDragActive ? "border-gray-800 bg-white" : "border-gray-800 bg-white"
//           }`}
//         >
//           <input {...getInputProps()} />
//           {isDragActive ? (
//             <p className="text-blue-500">Drop the images here...</p>
//           ) : (
//             <p className="text-gray-500">
//               Drag and drop images here, or click to select files
//             </p>
//           )}
//         </div>
//       </div>
     
//     </div>
//   );
// };

// export default UploadProductImg;
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineFilePdf } from "react-icons/ai";
import { BsImage } from "react-icons/bs";

const UploadProductImg = ({ formData, setFormData }) => {
  const MAX_FILES = 20;
  const [previews, setPreviews] = useState(formData.product_img || []);

  const onDrop = (acceptedFiles) => {
    if (previews.length + acceptedFiles.length > MAX_FILES) {
      alert(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    const newPreviews = acceptedFiles.map((file) => {
      const fileType = file.type.startsWith('image/') ? 'image' : 'document';
      const preview = fileType === 'image' 
        ? URL.createObjectURL(file) 
        : null;
      
      return Object.assign(file, { 
        preview, 
        fileType,
        isExisting: false 
      });
    });
    
    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);
    setFormData((prev) => ({
      ...prev,
      product_img: updatedPreviews,
    }));
  };

  const removeFile = (index) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    setFormData((prev) => ({
      ...prev,
      product_img: updatedPreviews,
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': []
    }
  });

  // Clean up object URLs to avoid memory leaks
  React.useEffect(() => {
    return () => {
      previews.forEach((file) => {
        if (file.preview && typeof file.preview === 'string') {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [previews]);

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full border-dashed border-1 p-4 mx-auto rounded-lg">
        <div className="flex flex-col">
          <h2 className="text-base font-bold dark:text-gray-200 text-gray-800">Files</h2>
          <small className="dark:text-gray-300 text-gray-600 text-1">
            Upload images and PDF documents
          </small>
        </div>
        
        <div className="gap-4 flex flex-wrap my-2">
          {previews.map((file, index) => (
            <div key={index} className="relative group">
              {file.fileType === 'image' ? (
                // Image preview
                <div className="md:w-30 md:h-30 w-20 h-20 relative">
                  <img
                    src={file.preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute bottom-0 left-0 bg-gray-800 bg-opacity-70 text-white text-xs px-1 rounded-bl">
                    <BsImage className="inline mr-1" />
                    Image
                  </div>
                </div>
              ) : (
                // PDF preview
                <div className="md:w-30 md:h-30 w-20 h-20 flex flex-col items-center justify-center bg-gray-100 rounded">
                  <AiOutlineFilePdf className="text-red-500 text-2xl" />
                  <p className="text-xs text-gray-600 truncate w-full text-center mt-1">
                    {file.name.length > 10 ? `${file.name.substring(0, 10)}...` : file.name}
                  </p>
                  <div className="absolute bottom-0 left-0 bg-gray-800 bg-opacity-70 text-white text-xs px-1 rounded-bl">
                    PDF
                  </div>
                </div>
              )}
              
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white xsm:w-4 xsm:h-4 md:w-6 md:h-6 flex items-center justify-center rounded-full opacity-100 transition"
              >
                <RxCross2 />
              </button>
            </div>
          ))}
        </div>

        <p className="text-gray-800 dark:text-gray-200 mb-2 text-right">
          Uploaded {previews.length}/{MAX_FILES} files
        </p>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragActive ? "border-gray-800 bg-white" : "border-gray-800 bg-white"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-gray-500">
                Drag and drop images or PDF files here, or click to select files
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Supported formats: JPEG, PNG, PDF
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadProductImg;