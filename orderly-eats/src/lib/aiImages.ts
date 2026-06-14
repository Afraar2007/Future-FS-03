export function generateAIImage(name: string, width = 640, height = 480) {
  const normalizedName = name.trim();
  const hue = Array.from(normalizedName).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
  const bg1 = `hsl(${hue}, 85%, 72%)`;
  const bg2 = `hsl(${(hue + 70) % 360}, 75%, 58%)`;
  const shadow = `rgba(0,0,0,0.15)`;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}" />
      <stop offset="100%" stop-color="${bg2}" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="${shadow}" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
  <circle cx="${width / 2}" cy="${height * 0.45}" r="${Math.min(width, height) * 0.22}" fill="rgba(255,255,255,0.55)" filter="url(#shadow)" />
  <rect x="${width * 0.1}" y="${height * 0.15}" width="${width * 0.8}" height="${height * 0.16}" rx="${height * 0.05}" fill="rgba(255,255,255,0.5)" />
  <text x="50%" y="${height * 0.26}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="34" font-weight="700" fill="#111111">AI generated</text>
  <text x="50%" y="${height * 0.55}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="52" font-weight="800" fill="#111111">${escapeXml(normalizedName)}</text>
  <text x="50%" y="${height * 0.7}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="24" fill="#111111">Custom dish art</text>
  <circle cx="${width * 0.25}" cy="${height * 0.7}" r="${height * 0.06}" fill="rgba(255,255,255,0.65)" />
  <circle cx="${width * 0.75}" cy="${height * 0.7}" r="${height * 0.045}" fill="rgba(255,255,255,0.55)" />
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "\"":
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return char;
    }
  });
}
