const PALETTE = [
  { bg: "#fde8d0", fg: "#c04e00" },
  { bg: "#d0eafd", fg: "#1565c0" },
  { bg: "#d0fde8", fg: "#1b7a3e" },
  { bg: "#fde8f5", fg: "#c0006a" },
  { bg: "#f5e8fd", fg: "#6a00c0" },
  { bg: "#fdfde8", fg: "#7a7000" },
  { bg: "#e8fdfd", fg: "#006a7a" },
  { bg: "#fde8e8", fg: "#c00000" },
];

export function tagColor(tag) {
  let h = 0;
  for (const c of tag) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return PALETTE[h % PALETTE.length];
}
