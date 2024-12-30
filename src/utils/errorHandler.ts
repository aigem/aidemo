import { AxiosError } from 'axios';
import { performanceMonitor } from './performance';

// 错误处理器类
export class ErrorHandler {
    private static instance: ErrorHandler;
    private errorLogs: Array<{ timestamp: number; error: unknown; context?: string }> = [];

    private constructor() { }

    static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    // 获取错误消息
    getErrorMessage(error: unknown, context?: string): string {
        let message = '发生未知错误';

        if (error instanceof AxiosError) {
            message = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        }

        this.logError(error, context);
        return message;
    }

    // 记录错误
    logError(error: unknown, context?: string): void {
        this.errorLogs.push({
            timestamp: Date.now(),
            error,
            context
        });

        // 限制日志数量
        if (this.errorLogs.length > 100) {
            this.errorLogs = this.errorLogs.slice(-100);
        }

        // 在开发环境下打印错误
        if (process.env.NODE_ENV === 'development') {
            console.error(`[${context || 'Error'}]`, error);
        }
    }

    // 获取错误日志
    getErrorLogs(): Array<{ timestamp: number; error: unknown; context?: string }> {
        return [...this.errorLogs];
    }

    // 清除错误日志
    clearErrorLogs(): void {
        this.errorLogs = [];
    }

    // 重试机制
    async retry<T>(
        operation: () => Promise<T>,
        maxAttempts: number = 3,
        delay: number = 1000
    ): Promise<T> {
        let lastError: unknown;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                if (attempt === maxAttempts) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }

        throw lastError;
    }

    // 错误处理包装器
    async withErrorHandling<T>(
        operation: () => Promise<T>,
        context?: string
    ): Promise<T> {
        try {
            return await operation();
        } catch (error) {
            const message = this.getErrorMessage(error, context);
            throw new Error(message);
        }
    }

    // 全局错误处理器
    handleGlobalError(error: Error, info?: any): void {
        this.logError(error, info);
        console.error('全局错误:', error);
        // 可以在这里添加错误上报逻辑
    }

    // 处理未捕获的 Promise 错误
    handleUnhandledRejection(event: PromiseRejectionEvent): void {
        const error = event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason));

        this.logError(error, {
            type: 'unhandledRejection',
            event
        });
        console.error('未处理的 Promise 错误:', error);
    }

    // 处理未捕获的错误
    handleUncaughtException(error: Error): void {
        this.logError(error, {
            type: 'uncaughtException'
        });
        console.error('未捕获的错误:', error);
    }
}

// 导出错误处理器实例
export const errorHandler = ErrorHandler.getInstance(); 