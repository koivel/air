export class LinearScale {
  public static scale(
    domain: number[],
    range: number[],
    value: number
  ): number {
    const minValue = domain[0];
    const maxValue = domain[1];

    const minScale = range[0];
    const maxScale = range[1];

    const ratio = (maxScale - minScale) / (maxValue - minValue);
    const result = minScale + ratio * (value - minValue);

    if (result === Infinity) return maxScale;
    else if (result === -Infinity) return minScale;
    
    return result;
  }
}
