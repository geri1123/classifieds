import React from 'react';

const Button = ({ loading, children, ...props }) => {
  return (
    <button
      className={` w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400`}
      disabled={loading}
      {...props}
    >
      {loading ? "loading..." : children}
    </button>
  );
};

export default Button;