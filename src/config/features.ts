import { configManager } from './index';

type Config = ReturnType<typeof configManager.getConfig>;
type FeatureFlag = keyof Config['features'];

export class FeatureManager {
    private static instance: FeatureManager;
    private overrides: Partial<Record<FeatureFlag, boolean>> = {};

    private constructor() {
        this.loadOverrides();
    }

    static getInstance(): FeatureManager {
        if (!FeatureManager.instance) {
            FeatureManager.instance = new FeatureManager();
        }
        return FeatureManager.instance;
    }

    isEnabled(feature: FeatureFlag): boolean {
        // 首先检查是否有覆盖设置
        if (feature in this.overrides) {
            return this.overrides[feature]!;
        }

        // 否则返回配置中的默认值
        return configManager.getConfig().features[feature];
    }

    setOverride(feature: FeatureFlag, enabled: boolean): void {
        this.overrides[feature] = enabled;
        this.saveOverrides();
    }

    clearOverride(feature: FeatureFlag): void {
        delete this.overrides[feature];
        this.saveOverrides();
    }

    clearAllOverrides(): void {
        this.overrides = {};
        this.saveOverrides();
    }

    private loadOverrides(): void {
        try {
            const saved = localStorage.getItem('featureOverrides');
            if (saved) {
                this.overrides = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load feature overrides:', error);
        }
    }

    private saveOverrides(): void {
        try {
            localStorage.setItem('featureOverrides', JSON.stringify(this.overrides));
        } catch (error) {
            console.error('Failed to save feature overrides:', error);
        }
    }

    getAllFeatures(): Record<FeatureFlag, boolean> {
        const config = configManager.getConfig().features;
        return Object.keys(config).reduce((acc, key) => {
            const feature = key as FeatureFlag;
            acc[feature] = this.isEnabled(feature);
            return acc;
        }, {} as Record<FeatureFlag, boolean>);
    }
}

export const featureManager = FeatureManager.getInstance(); 