import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate an array of colors for charts
 * @param count Number of colors to generate
 * @returns Array of colors in hex format
 */
export function generateChartColors(count: number): string[] {
  // Base colors for the application theme
  const baseColors = [
    '#3f51b5', // primary
    '#4caf50', // secondary
    '#ff9800', // warning
    '#f44336', // error
    '#9c27b0', // purple
    '#2196f3', // blue
    '#009688', // teal
    '#ff5722', // orange
    '#795548', // brown
    '#607d8b'  // gray
  ];

  // If we need more colors than in our base array, generate variations
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  } else {
    const colors = [...baseColors];
    // Generate additional colors by adjusting luminosity of existing ones
    for (let i = 0; colors.length < count; i++) {
      const baseColor = baseColors[i % baseColors.length];
      const hslColor = hexToHSL(baseColor);
      // Adjust lightness
      hslColor.l = Math.max(30, Math.min(80, hslColor.l + (i * 7) % 40 - 20));
      colors.push(hslToHex(hslColor));
    }
    return colors;
  }
}

// Helper function to convert hex to HSL
function hexToHSL(hex: string): { h: number, s: number, l: number } {
  // Remove the # if present
  hex = hex.replace(/^#/, '');

  // Parse the hex values
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find greatest and smallest color components
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Helper function to convert HSL to hex
function hslToHex({ h, s, l }: { h: number, s: number, l: number }): string {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert to hex
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
