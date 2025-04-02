
// import React, { useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { RxCross2 } from "react-icons/rx";
// import { AiOutlineFilePdf } from "react-icons/ai";
// import { BsImage } from "react-icons/bs";

// const UploadProductImg = ({ formData, setFormData }) => {
//   const MAX_FILES = 20;
//   const [previews, setPreviews] = useState(formData.product_img || []);

//   const onDrop = (acceptedFiles) => {
//     if (previews.length + acceptedFiles.length > MAX_FILES) {
//       alert(`You can upload a maximum of ${MAX_FILES} files.`);
//       return;
//     }

//     const newPreviews = acceptedFiles.map((file) => {
//       const fileType = file.type.startsWith('image/') ? 'image' : 'document';
//       const preview = fileType === 'image' 
//         ? URL.createObjectURL(file) 
//         : null;
      
//       return Object.assign(file, { 
//         preview, 
//         fileType,
//         isExisting: false 
//       });
//     });
    
//     const updatedPreviews = [...previews, ...newPreviews];
//     setPreviews(updatedPreviews);
//     setFormData((prev) => ({
//       ...prev,
//       product_img: updatedPreviews,
//     }));
//   };

//   const removeFile = (index) => {
//     const updatedPreviews = previews.filter((_, i) => i !== index);
//     setPreviews(updatedPreviews);
//     setFormData((prev) => ({
//       ...prev,
//       product_img: updatedPreviews,
//     }));
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
//     onDrop,
//     accept: {
//       'image/*': [],
//       'application/pdf': []
//     }
//   });

//   // Clean up object URLs to avoid memory leaks
//   React.useEffect(() => {
//     return () => {
//       previews.forEach((file) => {
//         if (file.preview && typeof file.preview === 'string') {
//           URL.revokeObjectURL(file.preview);
//         }
//       });
//     };
//   }, [previews]);

//   return (
//     <div className="flex flex-col gap-3">
//       <div className="w-full border-dashed border-1 p-4 mx-auto rounded-lg">
//         <div className="flex flex-col">
//           <h2 className="text-base font-bold dark:text-gray-200 text-gray-800">Files</h2>
//           <small className="dark:text-gray-300 text-gray-600 text-1">
//             Upload images and PDF documents
//           </small>
//         </div>
        
//         <div className="gap-4 flex flex-wrap my-2">
//           {previews.map((file, index) => (
//             <div key={index} className="relative group">
//               {file.fileType === 'image' ? (
//                 // Image preview
//                 <div className="md:w-30 md:h-30 w-20 h-20 relative">
//                   <img
//                     src={file.preview}
//                     alt={`Preview ${index}`}
//                     className="w-full h-full object-cover rounded"
//                   />
//                   <div className="absolute bottom-0 left-0 bg-gray-800 bg-opacity-70 text-white text-xs px-1 rounded-bl">
//                     <BsImage className="inline mr-1" />
//                     Image
//                   </div>
//                 </div>
//               ) : (
//                 // PDF preview
//                 <div className="md:w-30 md:h-30 w-20 h-20 flex flex-col items-center justify-center bg-gray-100 rounded">
//                   <AiOutlineFilePdf className="text-red-500 text-2xl" />
//                   <p className="text-xs text-gray-600 truncate w-full text-center mt-1">
//                     {file.name.length > 10 ? `${file.name.substring(0, 10)}...` : file.name}
//                   </p>
//                   <div className="absolute bottom-0 left-0 bg-gray-800 bg-opacity-70 text-white text-xs px-1 rounded-bl">
//                     PDF
//                   </div>
//                 </div>
//               )}
              
//               <button
//                 onClick={() => removeFile(index)}
//                 className="absolute top-1 right-1 bg-red-500 text-white xsm:w-4 xsm:h-4 md:w-6 md:h-6 flex items-center justify-center rounded-full opacity-100 transition"
//               >
//                 <RxCross2 />
//               </button>
//             </div>
//           ))}
//         </div>

//         <p className="text-gray-800 dark:text-gray-200 mb-2 text-right">
//           Uploaded {previews.length}/{MAX_FILES} files
//         </p>

//         <div
//           {...getRootProps()}
//           className={`border-2 border-dashed rounded-lg p-6 text-center ${
//             isDragActive ? "border-gray-800 bg-white" : "border-gray-800 bg-white"
//           }`}
//         >
//           <input {...getInputProps()} />
//           {isDragActive ? (
//             <p className="text-blue-500">Drop the files here...</p>
//           ) : (
//             <div>
//               <p className="text-gray-500">
//                 Drag and drop images or PDF files here, or click to select files
//               </p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Supported formats: JPEG, PNG, PDF
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadProductImg;
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineFilePdf } from "react-icons/ai";
import { BsImage, BsCloudUpload } from "react-icons/bs";
import { FiFileText } from "react-icons/fi";

const UploadProductImg = ({ formData, setFormData }) => {
  const MAX_IMAGES = 10;
  const MAX_DOCUMENTS = 5;
  
  // Split files into images and documents
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Initialize from formData if available
  useEffect(() => {
    if (formData.product_img && formData.product_img.length > 0) {
      setImages(formData.product_img);
    }
    
    if (formData.product_doc && formData.product_doc.length > 0) {
      setDocuments(formData.product_doc);
    }
  }, []);

  // Update parent form data whenever files change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      product_img: images,
      product_doc: documents
    }));
  }, [images, documents]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      [...images, ...documents].forEach((file) => {
        if (file.preview && typeof file.preview === 'string' && !file.isExisting) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [images, documents]);

  // Handler for image dropzone
  const onDropImages = (acceptedFiles) => {
    if (images.length + acceptedFiles.length > MAX_IMAGES) {
      alert(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const newImages = acceptedFiles.map((file) => 
      Object.assign(file, { 
        preview: URL.createObjectURL(file),
        fileType: 'image',
        isExisting: false 
      })
    );
    
    setImages(prev => [...prev, ...newImages]);
  };

  // Handler for document dropzone
  const onDropDocuments = (acceptedFiles) => {
    if (documents.length + acceptedFiles.length > MAX_DOCUMENTS) {
      alert(`You can upload a maximum of ${MAX_DOCUMENTS} documents.`);
      return;
    }

    const newDocuments = acceptedFiles.map((file) => 
      Object.assign(file, { 
        preview: null,
        fileType: 'document',
        isExisting: false 
      })
    );
    
    setDocuments(prev => [...prev, ...newDocuments]);
  };

  // Remove functions
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // Setup dropzones
  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive
  } = useDropzone({ 
    onDrop: onDropImages,
    accept: {
      'image/*': []
    }
  });

  const {
    getRootProps: getDocumentRootProps,
    getInputProps: getDocumentInputProps,
    isDragActive: isDocumentDragActive
  } = useDropzone({ 
    onDrop: onDropDocuments,
    accept: {
      'application/pdf': []
    }
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Images Section */}
      <div className="w-full border-dashed border-1 p-4 mx-auto rounded-lg">
        <div className="flex flex-col mb-3">
          <h2 className="text-base font-bold dark:text-gray-200 text-gray-800 flex items-center">
            <BsImage className="mr-2" /> Product Images
          </h2>
          <small className="dark:text-gray-300 text-gray-600 text-xs">
            Upload JPG, PNG images (max {MAX_IMAGES})
          </small>
        </div>
        
        <div className="gap-4 flex flex-wrap my-3">
          {images.map((file, index) => (
            <div key={index} className="relative group">
              <div className="md:w-30 md:h-30 w-20 h-20 relative">
                <img
                  src={file.preview || file.url} // Support both new uploads and existing files
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white xsm:w-4 xsm:h-4 md:w-6 md:h-6 flex items-center justify-center rounded-full opacity-100 transition"
              >
                <RxCross2 />
              </button>
            </div>
          ))}
        </div>

        <p className="text-gray-800 dark:text-gray-200 mb-2 text-right text-sm">
          Uploaded {images.length}/{MAX_IMAGES} images
        </p>

        <div
          {...getImageRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isImageDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
          }`}
        >
          <input {...getImageInputProps()} />
          <BsCloudUpload className="mx-auto text-3xl text-gray-400 mb-2" />
          {isImageDragActive ? (
            <p className="text-blue-500">Drop the images here...</p>
          ) : (
            <div>
              <p className="text-gray-500">
                Drag and drop images here, or click to select
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Supported formats: JPEG, PNG
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Documents Section */}
      <div className="w-full border-dashed border-1 p-4 mx-auto rounded-lg">
        <div className="flex flex-col mb-3">
          <h2 className="text-base font-bold dark:text-gray-200 text-gray-800 flex items-center">
            <FiFileText className="mr-2" /> Product Documents
          </h2>
          <small className="dark:text-gray-300 text-gray-600 text-xs">
            Upload PDF documents (max {MAX_DOCUMENTS})
          </small>
        </div>
        
        <div className="gap-4 flex flex-wrap my-3">
          {documents.map((file, index) => (
            <div key={index} className="relative group">
              <div className="md:w-30 md:h-30 w-20 h-20 flex flex-col items-center justify-center bg-gray-100 rounded">
                <AiOutlineFilePdf className="text-red-500 text-2xl" />
                <p className="text-xs text-gray-600 truncate w-full text-center mt-1 px-2">
                  {(file.name || file.originalname || "Document").length > 12 
                    ? `${(file.name || file.originalname).substring(0, 12)}...` 
                    : (file.name || file.originalname || "Document")}
                </p>
              </div>
              
              <button
                onClick={() => removeDocument(index)}
                className="absolute top-1 right-1 bg-red-500 text-white xsm:w-4 xsm:h-4 md:w-6 md:h-6 flex items-center justify-center rounded-full opacity-100 transition"
              >
                <RxCross2 />
              </button>
            </div>
          ))}
        </div>

        <p className="text-gray-800 dark:text-gray-200 mb-2 text-right text-sm">
          Uploaded {documents.length}/{MAX_DOCUMENTS} documents
        </p>

        <div
          {...getDocumentRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDocumentDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
          }`}
        >
          <input {...getDocumentInputProps()} />
          <BsCloudUpload className="mx-auto text-3xl text-gray-400 mb-2" />
          {isDocumentDragActive ? (
            <p className="text-blue-500">Drop the documents here...</p>
          ) : (
            <div>
              <p className="text-gray-500">
                Drag and drop PDF documents here, or click to select
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Supported format: PDF
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadProductImg;