export function isHexColor(str: string): boolean {
  const hexColorRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
  return hexColorRegex.test(str);
}
