export default function tablify<T, K extends keyof T>(
  arr: T[],
  key: K,
  omit?: K[],
): Record<K, T> {
  return arr.reduce(
    (acc, obj) => {
      const clone = structuredClone(obj);

      [key, ...(omit ?? [])].forEach((omitKey) => {
        delete clone[omitKey];
      });

      acc[obj[key] as K] = clone;
      return acc;
    },
    {} as Record<K, T>,
  );
}
