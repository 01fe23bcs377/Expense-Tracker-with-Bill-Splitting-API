import React from 'react';

export const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, className = '', min, max, step }) => {
    return (
        <div className={`flex flex-col space-y-1 ${className}`}>
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min}
                max={max}
                step={step}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
            />
        </div>
    );
};
