import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'medium' | 'large';
    fullscreen?: boolean;
}

export function LoadingSpinner({
    message = '加载中...',
    size = 'medium',
    fullscreen = false
}: LoadingSpinnerProps) {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12'
    };

    const containerClasses = fullscreen
        ? 'fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75'
        : 'flex flex-col items-center justify-center';

    return (
        <div className={containerClasses}>
            <div className="text-center">
                <div
                    className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} mx-auto`}
                />
                {message && (
                    <p className="mt-2 text-sm text-gray-600">{message}</p>
                )}
            </div>
        </div>
    );
} 