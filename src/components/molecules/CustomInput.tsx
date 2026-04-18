import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const CustomInput: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-800 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
      />
    </div>
  );
};

export default CustomInput;