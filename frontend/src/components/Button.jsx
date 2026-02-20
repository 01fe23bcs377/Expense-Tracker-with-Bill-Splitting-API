import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', type = 'button', className = '', disabled = false }) => {
    const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
        primary: "bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300",
        danger: "bg-red-50 hover:bg-red-100 text-red-600 focus:ring-red-500",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
};
