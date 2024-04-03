export function toDictionary<T, T2 = T>(
  items: T[],
  keySelector: (item: T, index: number) => string,
  valueSelector?: (item: T, index: number) => T2,
): { [key: string]: T2 };

export function toDictionary<T, T2 = T>(
  items: T[],
  keySelector: (item: T, index: number) => number,
  valueSelector?: (item: T, index: number) => T2,
): { [key: number]: T2 };

export function toDictionary<T, T2 = T>(
  items: T[],
  keySelector: (item: T, index: number) => number | string,
  valueSelector?: (item: T, index: number) => T2,
) {
  const objectMap: Record<ReturnType<typeof keySelector>, T2> = {};

  if (!items) {
    return {};
  }

  if (!keySelector) {
    throw new Error('Key selector is not defined.');
  }

  if (!valueSelector) {
    valueSelector = function (item: T) {
      return item as unknown as T2;
    };
  }

  for (let i = 0; i < items.length; i++) {
    const key = keySelector(items[i], i);
    if (!Object.prototype.hasOwnProperty.call(objectMap, key)) {
      objectMap[key] = valueSelector(items[i], i);
    }
  }

  return objectMap;
}
