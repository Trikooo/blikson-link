/**
 * Convert a camel case string to a kebab case string.
 * @param str - The camel case string to convert.
 * @returns The kebab case string.
 */
export default function camelToKebab(str: string) {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}