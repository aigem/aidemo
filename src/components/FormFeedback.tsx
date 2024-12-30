import React from 'react';

interface FormFeedbackProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

export function FormFeedback({ type, message }: FormFeedbackProps) {
    const getColorClasses = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 text-green-800 border-green-200';
            case 'error':
                return 'bg-red-50 text-red-800 border-red-200';
            case 'warning':
                return 'bg-yellow-50 text-yellow-800 border-yellow-200';
            case 'info':
                return 'bg-blue-50 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-50 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className={`p-4 mb-4 rounded-md border ${getColorClasses()}`}>
            <p className="text-sm">{message}</p>
        </div>
    );
} 