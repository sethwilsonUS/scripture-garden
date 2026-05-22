const pairs = [
  {
    name: "light foreground on surface",
    foreground: "#1a1a1a",
    background: "#f7f6f3",
    minimum: 4.5,
  },
  {
    name: "light secondary on surface",
    foreground: "#4b5441",
    background: "#f7f6f3",
    minimum: 4.5,
  },
  {
    name: "light accent on surface",
    foreground: "#036b4a",
    background: "#f7f6f3",
    minimum: 4.5,
  },
  {
    name: "light primary button",
    foreground: "#ffffff",
    background: "#036b4a",
    minimum: 4.5,
  },
  {
    name: "dark foreground on surface",
    foreground: "#f0ede6",
    background: "#171717",
    minimum: 4.5,
  },
  {
    name: "dark secondary on surface",
    foreground: "#a8b89e",
    background: "#171717",
    minimum: 4.5,
  },
  {
    name: "dark accent on surface",
    foreground: "#34d399",
    background: "#171717",
    minimum: 4.5,
  },
  {
    name: "dark primary button",
    foreground: "#ffffff",
    background: "#047857",
    minimum: 4.5,
  },
];

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function channelToLinear(channel) {
  const value = channel / 255;
  return value <= 0.03928
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

function contrastRatio(foreground, background) {
  const first = luminance(foreground);
  const second = luminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
}

const failures = [];

for (const pair of pairs) {
  const ratio = contrastRatio(pair.foreground, pair.background);
  const passed = ratio >= pair.minimum;
  const label = passed ? "PASS" : "FAIL";

  console.log(`${label} ${pair.name}: ${ratio.toFixed(2)}:1`);

  if (!passed) {
    failures.push(pair.name);
  }
}

if (failures.length > 0) {
  console.error(
    `Contrast check failed for ${failures.length} pair(s): ${failures.join(", ")}`,
  );
  process.exit(1);
}
