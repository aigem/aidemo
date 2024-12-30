import React from 'react';
import { Alert, Result, Button } from 'antd';
import styled from '@emotion/styled';
import { ApiError } from '../utils/apiClient';

// 错误容器样式
const ErrorContainer = styled.div`
    margin: 16px 0;
`;

// 错误提示属性接口
interface ErrorMessageProps {
    error: Error | ApiError | string | null;
    type?: 'inline' | 'alert' | 'page';
    retry?: () => void;
    className?: string;
}

// 获取错误信息
const getErrorMessage = (error: Error | ApiError | string | null): string => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (error instanceof ApiError) {
        return error.message || `请求失败 (${error.status || '未知状态'})`;
    }
    return error.message || '发生未知错误';
};

// 获取错误状态码
const getErrorStatus = (error: Error | ApiError | string | null): number => {
    if (error instanceof ApiError && error.status) {
        return error.status;
    }
    return 500;
};

// 错误提示组件
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    error,
    type = 'inline',
    retry,
    className
}) => {
    if (!error) return null;

    const message = getErrorMessage(error);
    const status = getErrorStatus(error);

    switch (type) {
        case 'alert':
            return (
                <ErrorContainer className={className}>
                    <Alert
                        message="错误"
                        description={message}
                        type="error"
                        showIcon
                        action={
                            retry && (
                                <Button size="small" danger onClick={retry}>
                                    重试
                                </Button>
                            )
                        }
                    />
                </ErrorContainer>
            );

        case 'page':
            return (
                <Result
                    status="error"
                    title={`错误 ${status}`}
                    subTitle={message}
                    extra={
                        retry && (
                            <Button type="primary" onClick={retry}>
                                重试
                            </Button>
                        )
                    }
                />
            );

        default:
            return (
                <ErrorContainer className={className}>
                    <span style={{ color: '#ff4d4f' }}>{message}</span>
                    {retry && (
                        <Button
                            type="link"
                            size="small"
                            onClick={retry}
                            style={{ marginLeft: 8 }}
                        >
                            重试
                        </Button>
                    )}
                </ErrorContainer>
            );
    }
};

// 错误边界组件
interface ErrorBoundaryState {
    error: Error | null;
}

export class ErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback?: React.ReactNode },
    ErrorBoundaryState
> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('组件错误:', error, errorInfo);
    }

    render() {
        const { error } = this.state;
        const { children, fallback } = this.props;

        if (error) {
            return (
                fallback || (
                    <ErrorMessage
                        error={error}
                        type="page"
                        retry={() => this.setState({ error: null })}
                    />
                )
            );
        }

        return children;
    }
}

// 导出错误边界HOC
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: React.ReactNode
) {
    return function WithErrorBoundaryComponent(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
} 