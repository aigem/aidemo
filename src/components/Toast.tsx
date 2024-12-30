import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

export function Toast({
    message,
    type = 'info',
    duration = 3000,
    onClose
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // 等待动画结束
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const baseClasses = 'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2';
    const typeClasses = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-white'
    };

    const visibilityClasses = isVisible
        ? 'opacity-100 transform translate-y-0'
        : 'opacity-0 transform translate-y-2';

    return (
        <div className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses}`}>
            <span>{message}</span>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// Toast 管理器
export class ToastManager {
    private static instance: ToastManager;
    private listeners: Array<(message: string, type: ToastType) => void> = [];

    private constructor() { }

    static getInstance(): ToastManager {
        if (!ToastManager.instance) {
            ToastManager.instance = new ToastManager();
        }
        return ToastManager.instance;
    }

    addListener(listener: (message: string, type: ToastType) => void): void {
        this.listeners.push(listener);
    }

    removeListener(listener: (message: string, type: ToastType) => void): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    show(message: string, type: ToastType = 'info'): void {
        this.listeners.forEach(listener => listener(message, type));
    }

    success(message: string): void {
        this.show(message, 'success');
    }

    error(message: string): void {
        this.show(message, 'error');
    }

    warning(message: string): void {
        this.show(message, 'warning');
    }

    info(message: string): void {
        this.show(message, 'info');
    }
}

export const toastManager = ToastManager.getInstance(); 