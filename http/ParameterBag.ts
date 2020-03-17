export class ParameterBag {
    private bag: any = {};
    public set(key: string, value: string) {
        this.bag[key] = value;
        return this;
    }
    public get(key: string, defaultValue: any = null) {
        if (!this.bag[key]) {
            return defaultValue;
        }
        return this.bag[key];
    }
    public has(key: string) {
        if (this.bag[key]) {
            return true;
        }
        return false;
    }
    public flush() {
        this.bag = {};
        return this;
    }
    public all() {
        return this.bag;
    }
}
