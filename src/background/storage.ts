import browser from "webextension-polyfill";

export class Storage<T> {
  constructor(
    private key: string,
    private validator: (v: unknown) => T | Promise<T>,
  ) {}

  async get(): Promise<T | undefined | null> {
    try {
      const result = await browser.storage.sync.get(this.key);
      return await this.validator(result[this.key]);
    } catch (error) {
      return null;
    }
  }

  async set(value: T): Promise<void> {
    await browser.storage.sync.set({ [this.key]: value });
  }
}
