import React from 'react';
import { Form } from 'antd';
import { Rule } from 'antd/lib/form';
import { InputField, SelectField, createValidationRules } from './FormFeedback';

// 基础表单属性接口
export interface BaseAppFormProps {
    initialValues?: Partial<App>;
    onFinish?: (values: App) => void;
    onFinishFailed?: (errorInfo: any) => void;
    loading?: boolean;
    children?: React.ReactNode;
}

// 通用验证规则
export const appValidationRules = {
    name: [
        createValidationRules.required('应用名称不能为空'),
        createValidationRules.max(50, '应用名称不能超过50个字符')
    ],
    directUrl: [
        createValidationRules.required('应用地址不能为空'),
        createValidationRules.url('请输入有效的URL地址')
    ],
    category: [
        createValidationRules.required('应用类别不能为空')
    ],
    description: [
        createValidationRules.max(200, '应用描述不能超过200个字符')
    ]
};

// 类别选项
export const categoryOptions = [
    { label: '对话', value: '对话' },
    { label: '图像', value: '图像' },
    { label: '音频', value: '音频' },
    { label: '视频', value: '视频' },
    { label: '文本', value: '文本' },
    { label: '其他', value: '其他' }
];

// 基础表单组件
export const BaseAppForm: React.FC<BaseAppFormProps> = ({
    initialValues,
    onFinish,
    onFinishFailed,
    loading,
    children
}) => {
    const [form] = Form.useForm();

    // 表单提交处理
    const handleFinish = async (values: any) => {
        try {
            // 标准化URL
            const directUrl = values.directUrl.trim();
            const normalizedValues = {
                ...values,
                directUrl: directUrl.endsWith('/') ? directUrl.slice(0, -1) : directUrl
            };

            onFinish?.(normalizedValues);
        } catch (error) {
            console.error('表单提交错误:', error);
            onFinishFailed?.(error);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={handleFinish}
            onFinishFailed={onFinishFailed}
            disabled={loading}
        >
            <InputField
                name="name"
                label="应用名称"
                rules={appValidationRules.name}
                required
                maxLength={50}
                placeholder="请输入应用名称"
            />

            <InputField
                name="directUrl"
                label="应用地址"
                rules={appValidationRules.directUrl}
                required
                placeholder="请输入应用URL地址"
            />

            <SelectField
                name="category"
                label="应用类别"
                rules={appValidationRules.category}
                required
                options={categoryOptions}
                placeholder="请选择应用类别"
            />

            <InputField
                name="description"
                label="应用描述"
                rules={appValidationRules.description}
                maxLength={200}
                placeholder="请输入应用描述"
            />

            {children}
        </Form>
    );
};

// 导出类型
export type { App }; 