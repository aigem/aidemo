import type { GradioApp } from '../types/app';
import { CATEGORIES } from '../types/app';

// 错误类型
export type ErrorType =
    | 'VALIDATION_ERROR'
    | 'API_ERROR'
    | 'STORAGE_ERROR'
    | 'NETWORK_ERROR'
    | 'AUTH_ERROR'
    | 'NOT_FOUND'
    | 'PERMISSION_ERROR';

// 应用错误类
export class AppError extends Error {
    constructor(
        message: string,
        public type: ErrorType,
        public details?: any
    ) {
        super(message);
        this.name = 'AppError';
    }
}

// 验证规则接口
export interface ValidationRule<T> {
    validate: (value: T) => boolean;
    message: string;
}

// 验证器类
export class Validator<T> {
    private rules: ValidationRule<T>[] = [];

    addRule(rule: ValidationRule<T>): this {
        this.rules.push(rule);
        return this;
    }

    validate(value: T): string | null {
        for (const rule of this.rules) {
            if (!rule.validate(value)) {
                return rule.message;
            }
        }
        return null;
    }
}

// 通用验证规则
export const commonRules = {
    required: (message = '此字段为必填项'): ValidationRule<any> => ({
        validate: value => value !== undefined && value !== null && value !== '',
        message
    }),

    maxLength: (max: number, message = `长度不能超过 ${max} 个字符`): ValidationRule<string> => ({
        validate: value => !value || value.length <= max,
        message
    }),

    minLength: (min: number, message = `长度不能少于 ${min} 个字符`): ValidationRule<string> => ({
        validate: value => !value || value.length >= min,
        message
    }),

    pattern: (pattern: RegExp, message = '格式不正确'): ValidationRule<string> => ({
        validate: value => !value || pattern.test(value),
        message
    }),

    url: (message = '请输入有效的URL'): ValidationRule<string> => ({
        validate: value => {
            if (!value) return true;
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        },
        message
    }),

    email: (message = '请输入有效的邮箱地址'): ValidationRule<string> => ({
        validate: value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message
    }),

    number: (message = '请输入有效的数字'): ValidationRule<any> => ({
        validate: value => !value || !isNaN(Number(value)),
        message
    }),

    min: (min: number, message = `不能小于 ${min}`): ValidationRule<number> => ({
        validate: value => !value || value >= min,
        message
    }),

    max: (max: number, message = `不能大于 ${max}`): ValidationRule<number> => ({
        validate: value => !value || value <= max,
        message
    })
};

// 创建验证器实例
export function createValidator<T>(): Validator<T> {
    return new Validator<T>();
}

// 导出默认验证器
export const validator = {
    string: () => createValidator<string>(),
    number: () => createValidator<number>(),
    boolean: () => createValidator<boolean>(),
    object: <T>() => createValidator<T>()
};

export class DataValidator {
    static validateApp(app: GradioApp): void {
        const errors: string[] = [];

        if (!app.directUrl?.trim()) {
            errors.push('应用地址不能为空');
        } else if (!/^https?:\/\/.+/.test(app.directUrl)) {
            errors.push('应用地址必须是有效的 URL');
        }

        if (!app.name?.trim()) {
            errors.push('应用名称不能为空');
        }

        if (!app.description?.trim()) {
            errors.push('应用描述不能为空');
        }

        if (!app.category) {
            app.category = '其他';
        } else if (!CATEGORIES.includes(app.category)) {
            errors.push(`无效的应用类别: ${app.category}。有效类别: ${CATEGORIES.join(', ')}`);
        }

        if (errors.length > 0) {
            throw AppError.validation('应用数据验证失败', errors);
        }
    }

    static validateBatch(apps: GradioApp[]): void {
        if (!Array.isArray(apps)) {
            throw AppError.validation('无效的应用数据格式');
        }

        const errors = new Map<number, string[]>();
        apps.forEach((app, index) => {
            try {
                this.validateApp(app);
            } catch (error) {
                if (error instanceof AppError && error.code === 'VALIDATION') {
                    errors.set(index, error.details);
                }
            }
        });

        if (errors.size > 0) {
            throw AppError.validation(
                '批量应用数据验证失败',
                Object.fromEntries(errors)
            );
        }
    }
} 