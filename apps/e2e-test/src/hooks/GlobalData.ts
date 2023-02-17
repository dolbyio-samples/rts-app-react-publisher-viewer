export class GlobalData {
  private static instance: GlobalData;
  private data;

  private constructor() {
    this.data = new Map();
  }

  static getInstance(): GlobalData {
    GlobalData.instance = GlobalData.instance || new GlobalData();
    return GlobalData.instance;
  }

  save<T>(key: string, value: T): void {
    this.data.set(key, value);
  }

  load<T>(key: string): T {
    if (this.data.has(key)) {
      return this.data.get(key);
    }
    throw new Error(`You tried to access ${key} property in the Global Data, but it does not exist.`);
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  getAllData() {
    return this.data;
  }
}
