// Programmatic WCAG 2.1 Contrast Checker for Unternehmerbörse (Hochschule Hof)

// 1. Theme Colors (globals.css / tailwind config)
const color_primary = "#EAB308";
const color_accent = "#0AD88E";
const color_secondary = "#3B82F6";
const color_destructive = "#EF4444";
const color_success = "#10B981";
const color_warning = "#F59E0B";
const color_foreground = "#F8FAFC";
const color_foreground_muted = "#94A3B8";
const color_foreground_link = "#60A5FA";
const color_surface = "#0D1117";

// 2. Official Brand Colors (Hochschule Hof logo & stripe)
const brand_yellow = "#FCCD01";
const brand_blue = "#2860F8";
const brand_green = "#0AD88E";
const brand_red = "#FE3D4E";

// 3. StudentInfoSection Colors (Light Background: #FFFFFF)
const student_bg = "#FFFFFF";
const student_yellow = "#9E7400"; // Dark yellow for light theme contrast
const student_blue = "#2860F9";
const student_red = "#FE3D4E";
const student_green = "#068053"; // Dark green for light theme contrast

// 4. ExhibitorInfoSection Colors (Dark Background: #0D1117)
const exhibitor_bg = "#0D1117";
const exhibitor_yellow = "#FCCD00";
const exhibitor_blue = "#2860F9";
const exhibitor_red = "#FE3D4E";
const exhibitor_green = "#0AD88E";

// Relative luminance function according to WCAG 2.1
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice( cleanHex.length === 6 ? 4 : 2, cleanHex.length === 6 ? 6 : 3), 16) / 255;
  
  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Contrast ratio function according to WCAG 2.1
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Helper to assert contrast ratios
function assertContrast(color1: string, color2: string, minRatio: number) {
  const ratio = getContrastRatio(color1, color2);
  expect(ratio).toBeGreaterThanOrEqual(minRatio);
}

describe('WCAG 2.1 AA Color Contrast Verification', () => {
  // --- A. Theme Colors vs Base Surface (#0D1117) & Text ---
  test('Theme Primary Yellow against Black has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(color_primary, '#000000', 4.5);
  });

  test('Theme Accent Green against Black has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(color_accent, '#000000', 4.5);
  });

  test('Theme Success Green against Black has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(color_success, '#000000', 4.5);
  });

  test('Theme Warning Orange against Black has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(color_warning, '#000000', 4.5);
  });

  test('Theme Secondary Blue against Black has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(color_secondary, '#000000', 4.5);
  });

  test('Theme Secondary Blue against White has sufficient AA Large/UI contrast (>= 3.0:1)', () => {
    assertContrast(color_secondary, '#FFFFFF', 3.0);
  });

  test('Theme Destructive Red against Black has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(color_destructive, '#000000', 4.5);
  });

  test('Theme Destructive Red against White has sufficient AA Large/UI contrast (>= 3.0:1)', () => {
    assertContrast(color_destructive, '#FFFFFF', 3.0);
  });

  test('Foreground White on Dark Surface has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(color_foreground, color_surface, 4.5);
  });

  test('Muted Text on Dark Surface has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(color_foreground_muted, color_surface, 4.5);
  });

  test('Link Text on Dark Surface has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(color_foreground_link, color_surface, 4.5);
  });

  // --- B. Brand Colors (Hochschule Hof logo & stripes) ---
  test('Brand Yellow against Black has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(brand_yellow, '#000000', 4.5);
  });

  test('Brand Green against Black has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(brand_green, '#000000', 4.5);
  });

  test('Brand Blue against Black has sufficient Large text/UI contrast (>= 3.0:1)', () => {
    assertContrast(brand_blue, '#000000', 3.0);
  });

  test('Brand Red against Black has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(brand_red, '#000000', 4.5);
  });

  // --- C. StudentInfoSection (Light Theme / White Background) ---
  test('Student Section Yellow against White has sufficient Large text/UI contrast (>= 3.0:1)', () => {
    assertContrast(student_yellow, student_bg, 3.0);
  });

  test('Student Section Blue against White has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(student_blue, student_bg, 4.5);
  });

  test('Student Section Red against White has sufficient Large text/UI contrast (>= 3.0:1)', () => {
    assertContrast(student_red, student_bg, 3.0);
  });

  test('Student Section Green against White has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(student_green, student_bg, 4.5);
  });

  // --- D. ExhibitorInfoSection (Dark Theme / Surface Background) ---
  test('Exhibitor Section Yellow against Surface has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(exhibitor_yellow, exhibitor_bg, 4.5);
  });

  test('Exhibitor Section Blue against Surface has sufficient Large text/UI contrast (>= 3.0:1)', () => {
    assertContrast(exhibitor_blue, exhibitor_bg, 3.0);
  });

  test('Exhibitor Section Red against Surface has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(exhibitor_red, exhibitor_bg, 4.5);
  });

  test('Exhibitor Section Green against Surface has sufficient AA contrast (>= 4.5:1)', () => {
    assertContrast(exhibitor_green, exhibitor_bg, 4.5);
  });
});
