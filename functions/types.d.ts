declare const my_kv: {
    get(key: string, options?: { type: string }): Promise<any>;
    put(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
        keys: Array<{ name: string }>;
        list_complete: boolean;
        cursor: string;
    }>;
}; 