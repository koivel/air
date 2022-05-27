import { injectable } from 'tsyringe';

type StoreValue<T> = { ttl: number; value: T };

@injectable()
export class TtlCache<T> {
  private store: Map<string, StoreValue<T>> = new Map();

  public computeIfAbsent(
    key: string,
    expiresIn: number,
    compute: () => T,
    unit: string = 'seconds'
  ) {
    let value = this.get(key);
    if (!value) {
      value = compute();
      if (value) {
        this.set(key, value, expiresIn, unit);
      }
    }
    return value;
  }

  public async computeIfAbsentAsync(
    key: string,
    expiresIn: number,
    compute: () => Promise<T>,
    unit: string = 'seconds'
  ) {
    let value = this.get(key);
    if (!value) {
      value = await compute();
      if (value) {
        this.set(key, value, expiresIn, unit);
      }
    }
    return value;
  }

  public get(key: string): T {
    const storeValue = this.store.get(key);
    if (!storeValue) {
      return null;
    }
    if (new Date().getTime() > storeValue.ttl) {
      this.store.delete(key);
      return null;
    }
    return storeValue.value;
  }

  public set(
    key: string,
    value: T,
    expiresIn: number,
    unit: string = 'seconds'
  ) {
    this.store.set(key, {
      ttl: expiresIn * 1000 + new Date().getTime(),
      value: value,
    });
  }
}
