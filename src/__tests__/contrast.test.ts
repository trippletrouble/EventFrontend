// Programmatic WCAG 2.1 Contrast Checker for Unternehmerbörse (Hochschule Hof)
// Verifies both Large Text (>= 18pt / 24px) and Small Text (normal body text) requirements.

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
const color_surface = "#050505";
const color_surface_raised = "#0F0F11"; // Card/form backgrounds

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

// 4. ExhibitorInfoSection Colors (Dark Background: #050505)
const exhibitor_bg = "#050505";
const exhibitor_yellow = "#FCCD00";
const exhibitor_blue = "#2860F9";
const exhibitor_red = "#FE3D4E";
const exhibitor_green = "#0AD88E";

// Relative luminance function according to WCAG 2.1
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(cleanHex.length === 6 ? 4 : 2, cleanHex.length === 6 ? 6 : 3), 16) / 255;
  
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

// Helper to assert contrast ratios for Small Text (AA target: 4.5:1, AAA target: 7.0:1)
function assertSmallTextAA(color1: string, color2: string) {
  const ratio = getContrastRatio(color1, color2);
  expect(ratio).toBeGreaterThanOrEqual(4.5);
}

// Helper to assert contrast ratios for Large Text (AA target: 3.0:1, AAA target: 4.5:1)
function assertLargeTextAA(color1: string, color2: string) {
  const ratio = getContrastRatio(color1, color2);
  expect(ratio).toBeGreaterThanOrEqual(3.0);
}

describe('WCAG 2.1 Color Contrast Verification (Large & Small Text)', () => {
  
  describe('A. Dark Theme Base Surface (#0D1117)', () => {
    test('Foreground White on Dark Surface has sufficient contrast for both Large (>=3:1) and Small (>=4.5:1) text', () => {
      assertLargeTextAA(color_foreground, color_surface);
      assertSmallTextAA(color_foreground, color_surface);
    });

    test('Muted Text on Dark Surface has sufficient contrast for both Large and Small text', () => {
      assertLargeTextAA(color_foreground_muted, color_surface);
      assertSmallTextAA(color_foreground_muted, color_surface);
    });

    test('Link Text on Dark Surface has sufficient contrast for both Large and Small text', () => {
      assertLargeTextAA(color_foreground_link, color_surface);
      assertSmallTextAA(color_foreground_link, color_surface);
    });

    test('Theme Primary Yellow on Dark Surface (with Black text) has sufficient contrast for both text sizes', () => {
      // Primary yellow acts as a background for primary buttons containing black text
      assertLargeTextAA(color_primary, '#000000');
      assertSmallTextAA(color_primary, '#000000');
    });

    test('Theme Accent Green on Dark Surface (with Black text) has sufficient contrast for both text sizes', () => {
      assertLargeTextAA(color_accent, '#000000');
      assertSmallTextAA(color_accent, '#000000');
    });
  });

  describe('B. Dark Theme Raised Surface (#1E293B) - e.g., Cards, Form Fields', () => {
    test('Foreground White on Raised Surface has sufficient contrast for both Large and Small text', () => {
      assertLargeTextAA(color_foreground, color_surface_raised);
      assertSmallTextAA(color_foreground, color_surface_raised);
    });

    test('Muted Text on Raised Surface has sufficient contrast for both Large and Small text (AA compliant, >=4.5:1)', () => {
      assertLargeTextAA(color_foreground_muted, color_surface_raised);
      assertSmallTextAA(color_foreground_muted, color_surface_raised);
    });

    test('Link Text on Raised Surface has sufficient contrast for both Large and Small text', () => {
      assertLargeTextAA(color_foreground_link, color_surface_raised);
      assertSmallTextAA(color_foreground_link, color_surface_raised);
    });
  });

  describe('C. Semantic Colors vs Base Dark Surface and Black/White', () => {
    test('Theme Success Green against Black has sufficient contrast for both text sizes', () => {
      assertLargeTextAA(color_success, '#000000');
      assertSmallTextAA(color_success, '#000000');
    });

    test('Theme Warning Orange against Black has sufficient contrast for both text sizes', () => {
      assertLargeTextAA(color_warning, '#000000');
      assertSmallTextAA(color_warning, '#000000');
    });

    test('Theme Secondary Blue against Black has sufficient contrast for both text sizes', () => {
      assertLargeTextAA(color_secondary, '#000000');
      assertSmallTextAA(color_secondary, '#000000');
    });

    test('Theme Secondary Blue against White has sufficient contrast for Large text (>=3:1)', () => {
      assertLargeTextAA(color_secondary, '#FFFFFF');
    });

    test('Theme Destructive Red against Black has sufficient contrast for both text sizes', () => {
      assertLargeTextAA(color_destructive, '#000000');
      assertSmallTextAA(color_destructive, '#000000');
    });

    test('Theme Destructive Red against White has sufficient contrast for Large text (>=3:1)', () => {
      assertLargeTextAA(color_destructive, '#FFFFFF');
    });
  });

  describe('D. Brand & Section Colors', () => {
    test('Brand Yellow against Black has sufficient contrast for both text sizes', () => {
      assertLargeTextAA(brand_yellow, '#000000');
      assertSmallTextAA(brand_yellow, '#000000');
    });

    test('Brand Green against Black has sufficient contrast for both text sizes', () => {
      assertLargeTextAA(brand_green, '#000000');
      assertSmallTextAA(brand_green, '#000000');
    });

    test('Brand Blue against Black has sufficient contrast for Large text (>=3:1)', () => {
      assertLargeTextAA(brand_blue, '#000000');
    });

    test('Brand Red against Black has sufficient contrast for both text sizes', () => {
      assertLargeTextAA(brand_red, '#000000');
      assertSmallTextAA(brand_red, '#000000');
    });

    test('Student Section Yellow on White has sufficient contrast for Large text (>=3:1)', () => {
      assertLargeTextAA(student_yellow, student_bg);
    });

    test('Student Section Blue on White has sufficient contrast for both text sizes', () => {
      assertLargeTextAA(student_blue, student_bg);
      assertSmallTextAA(student_blue, student_bg);
    });

    test('Student Section Red on White has sufficient contrast for Large text (>=3:1)', () => {
      assertLargeTextAA(student_red, student_bg);
    });

    test('Student Section Green on White has sufficient contrast for both text sizes', () => {
      assertLargeTextAA(student_green, student_bg);
      assertSmallTextAA(student_green, student_bg);
    });

    test('Exhibitor Section Yellow on Surface has sufficient contrast for both text sizes', () => {
      assertLargeTextAA(exhibitor_yellow, exhibitor_bg);
      assertSmallTextAA(exhibitor_yellow, exhibitor_bg);
    });

    test('Exhibitor Section Blue on Surface has sufficient contrast for Large text (>=3:1)', () => {
      assertLargeTextAA(exhibitor_blue, exhibitor_bg);
    });

    test('Exhibitor Section Red on Surface has sufficient contrast for both text sizes', () => {
      assertLargeTextAA(exhibitor_red, exhibitor_bg);
      assertSmallTextAA(exhibitor_red, exhibitor_bg);
    });

    test('Exhibitor Section Green on Surface has sufficient contrast for both text sizes', () => {
      assertLargeTextAA(exhibitor_green, exhibitor_bg);
      assertSmallTextAA(exhibitor_green, exhibitor_bg);
    });
  });
});
