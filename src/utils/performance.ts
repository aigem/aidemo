export interface PerformanceThresholds {
    warning: number;
    error: number;
    maxSampleSize: number;
}

export interface PerformanceMetric {
    total: number;
    count: number;
    max: number;
    min: number;
    samples: number[];
}

export class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private metrics: Map<string, PerformanceMetric> = new Map();
    private thresholds: Record<string, PerformanceThresholds> = {
        default: {
            warning: 1000, // 1秒
            error: 3000,   // 3秒
            maxSampleSize: 100
        }
    };
    private listeners: Array<(operation: string, duration: number, level: 'warning' | 'error') => void> = [];

    private constructor() {
        // 从本地存储加载性能数据
        this.loadMetrics();

        // 定期保存性能数据
        setInterval(() => this.saveMetrics(), 60000); // 每分钟保存一次
    }

    static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    // 设置性能阈值
    setThreshold(operation: string, thresholds: PerformanceThresholds): void {
        this.thresholds[operation] = thresholds;
    }

    // 添加性能警告监听器
    addListener(listener: (operation: string, duration: number, level: 'warning' | 'error') => void): void {
        this.listeners.push(listener);
    }

    // 移除性能警告监听器
    removeListener(listener: (operation: string, duration: number, level: 'warning' | 'error') => void): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    // 开始计时
    startOperation(operation: string): number {
        return performance.now();
    }

    // 结束计时并记录
    endOperation(operation: string, startTime: number): void {
        const duration = performance.now() - startTime;
        const threshold = this.thresholds[operation] || this.thresholds.default;

        const metric = this.metrics.get(operation) || {
            total: 0,
            count: 0,
            max: 0,
            min: Infinity,
            samples: []
        };

        metric.total += duration;
        metric.count += 1;
        metric.max = Math.max(metric.max, duration);
        metric.min = Math.min(metric.min, duration);

        // 保存样本数据
        metric.samples.push(duration);
        if (metric.samples.length > threshold.maxSampleSize) {
            metric.samples.shift();
        }

        this.metrics.set(operation, metric);

        // 性能警告
        if (duration > threshold.error) {
            this.notifyListeners(operation, duration, 'error');
        } else if (duration > threshold.warning) {
            this.notifyListeners(operation, duration, 'warning');
        }
    }

    // 通知监听器
    private notifyListeners(operation: string, duration: number, level: 'warning' | 'error'): void {
        this.listeners.forEach(listener => {
            try {
                listener(operation, duration, level);
            } catch (error) {
                console.error('性能监听器错误:', error);
            }
        });
    }

    // 获取性能指标
    getMetrics(): Record<string, {
        average: number;
        count: number;
        max: number;
        min: number;
        percentile95: number;
        percentile99: number;
    }> {
        const result: Record<string, any> = {};

        for (const [operation, metric] of this.metrics.entries()) {
            const sortedSamples = [...metric.samples].sort((a, b) => a - b);
            const p95Index = Math.floor(sortedSamples.length * 0.95);
            const p99Index = Math.floor(sortedSamples.length * 0.99);

            result[operation] = {
                average: metric.total / metric.count,
                count: metric.count,
                max: metric.max,
                min: metric.min,
                percentile95: sortedSamples[p95Index] || 0,
                percentile99: sortedSamples[p99Index] || 0
            };
        }

        return result;
    }

    // 获取特定操作的性能指标
    getOperationMetrics(operation: string): {
        average: number;
        count: number;
        max: number;
        min: number;
        percentile95: number;
        percentile99: number;
    } | null {
        const metric = this.metrics.get(operation);
        if (!metric) return null;

        const sortedSamples = [...metric.samples].sort((a, b) => a - b);
        const p95Index = Math.floor(sortedSamples.length * 0.95);
        const p99Index = Math.floor(sortedSamples.length * 0.99);

        return {
            average: metric.total / metric.count,
            count: metric.count,
            max: metric.max,
            min: metric.min,
            percentile95: sortedSamples[p95Index] || 0,
            percentile99: sortedSamples[p99Index] || 0
        };
    }

    // 清除指标
    clearMetrics(): void {
        this.metrics.clear();
        this.saveMetrics();
    }

    // 记录自定义指标
    recordCustomMetric(name: string, value: number): void {
        const metric = this.metrics.get(name) || {
            total: 0,
            count: 0,
            max: 0,
            min: Infinity,
            samples: []
        };

        metric.total += value;
        metric.count += 1;
        metric.max = Math.max(metric.max, value);
        metric.min = Math.min(metric.min, value);

        const threshold = this.thresholds[name] || this.thresholds.default;
        metric.samples.push(value);
        if (metric.samples.length > threshold.maxSampleSize) {
            metric.samples.shift();
        }

        this.metrics.set(name, metric);
    }

    // 保存性能数据到本地存储
    private saveMetrics(): void {
        try {
            const data: Record<string, PerformanceMetric> = {};
            this.metrics.forEach((metric, operation) => {
                data[operation] = metric;
            });
            localStorage.setItem('performance_metrics', JSON.stringify(data));
        } catch (error) {
            console.error('保存性能数据失败:', error);
        }
    }

    // 从本地存储加载性能数据
    private loadMetrics(): void {
        try {
            const data = localStorage.getItem('performance_metrics');
            if (data) {
                const metrics = JSON.parse(data);
                Object.entries(metrics).forEach(([operation, metric]) => {
                    this.metrics.set(operation, metric as PerformanceMetric);
                });
            }
        } catch (error) {
            console.error('加载性能数据失败:', error);
        }
    }
}

// 导出单例实例
export const performanceMonitor = PerformanceMonitor.getInstance(); 