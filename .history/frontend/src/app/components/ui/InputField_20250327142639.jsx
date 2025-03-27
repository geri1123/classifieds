import React from "react";

const InputField = ({
  label,
  value,
  onChange,
  id,
  name,
  placeholder,
  type,
  errors,
  disabled = false,
  infoMessage = null,
}) => {
  return (
    <div className="w-full mb-4">
      
      <label htmlFor={id} className="block text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <input
        value={value || ''}
        onChange={onChange}
        type={type}
        id={id}
        name={name}
        className={`mt-1 block w-full  focus:outline-none focus:ring-0  focus:shadow-none  p-2 border rounded-lg dark:bg-transparent ${
          errors ? 'border-red-600' : 'border-black'
        }`}
        placeholder={placeholder}
        disabled={disabled}
      />
      {errors && (
        <p className="text-sm text-red-600 mb-1">{errors}</p>
      )}
      {infoMessage && (
        <p className="text-sm text-gray-500 mt-1">{infoMessage}</p>
      )}
    </div>
  );
};

export default InputField;