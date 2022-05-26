export type ArrayComparator = (a: unknown, b: unknown) => boolean;

export class ObjUtils {
  private static defaultArrayComparator: ArrayComparator = (a, b): boolean =>
    a === b;

  public static hasValuesInCommon(
    firstArray: string[],
    secondArray: string[]
  ): boolean {
    let rval: boolean = false;
    firstArray.some((firstEl) => {
      secondArray.some((secondEl) => {
        rval = secondEl === firstEl;
        return rval;
      });
      return rval;
    });
    return rval;
  }

  public static resolveProperty(
    obj: unknown,
    propertyName: string
  ): unknown | undefined {
    let rval: any = obj;
    if (propertyName.length > 0) {
      propertyName.split('.').some((currentProp) => {
        rval = rval[currentProp];
        return rval === undefined;
      });
    }
    return rval;
  }

  public static propertyExists(obj: unknown, propertyName: string): boolean {
    return ObjUtils.resolveProperty(obj, propertyName) !== undefined;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static setProperty(
    obj: any,
    propertyName: string = '',
    value: unknown
  ): void {
    let current: any = obj;
    const stack: string[] =
      propertyName.length > 0 ? propertyName.split('.').reverse() : [];
    while (stack.length > 1) {
      const prop = stack.pop();
      if (current[prop] === undefined) {
        current[prop] = {};
      }
      current = current[prop];
    }
    current[stack.pop()] = value;
  }

  public static setPropertyIfMissing(
    obj: unknown,
    propertyName: string = '',
    value: unknown
  ): void {
    if (!ObjUtils.propertyExists(obj, propertyName)) {
      ObjUtils.setProperty(obj, propertyName, value);
    }
  }

  public static mergeProperty(
    srcObj: unknown,
    trgObj: unknown,
    propertyName: string,
    replace: boolean,
    comparator: ArrayComparator = ObjUtils.defaultArrayComparator,
    keyPrefix: string = '',
  ): void {
    const src = ObjUtils.resolveProperty(srcObj, propertyName);
    const trg = ObjUtils.resolveProperty(trgObj, propertyName);
    if (Array.isArray(src) && Array.isArray(trg)) {
      ObjUtils.mergeArray(src, trg, comparator, replace)
    } else if (src && trg) {
      ObjUtils.mergeObject(src, trg, replace, keyPrefix)
    }
  }

  public static mergeObject(
    src: unknown,
    trg: unknown,
    replace: boolean = true,
    keyPrefix: string = ''
  ): string[] {
    const rval: string[] = [];
    Object.keys(src).forEach((key) => {
      const isDupe = ObjUtils.propertyExists(trg, key);
      if (isDupe) {
        rval.push(key);
      }
      if (replace || !isDupe) {
        ObjUtils.setProperty(trg, keyPrefix + key, src[key]);
      }
    });
    return rval;
  }

  public static mergeArray(
    src: unknown[],
    trg: unknown[],
    comparator: ArrayComparator = ObjUtils.defaultArrayComparator,
    replace: boolean = false
  ): unknown[] {
    const rval: unknown[] = [];
    src.forEach((a) => {
      const isDupe = !!trg.find((b) => comparator(a, b));
      if (isDupe) {
        rval.push(a);
      }
      if (replace || !isDupe) {
        trg.push(a);
      }
    });
    return rval;
  }
}
