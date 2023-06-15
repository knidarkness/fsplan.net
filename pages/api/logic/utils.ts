export function isNotANumber(x: unknown) {
  return x == null || isNaN(x as any);
}
