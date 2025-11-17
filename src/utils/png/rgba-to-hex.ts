export default function rgbaToHex(
  r: number,
  g: number,
  b: number,
  a: number,
): `#${string}` {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}${a.toString(16).padStart(2, "0")}`;
}
