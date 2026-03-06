/**
 * Single source of truth for all theme colors.
 * Used by globals.css (CSS variables) and Tailwind. Change here to update the whole project.
 */

const light = {
  // App
  appBackground: "#ffffff",
  appNavbar: "#ffffff",
  textPrimary: "#000000",

  // Status / Actions
  edit: "#2563eb",
  editForeground: "#ffffff",
  destructive: "#ef4444",
  destructiveForeground: "#ffffff",
  primary: "#2563eb",
  primaryForeground: "#ffffff",

  // Table
  tableBg: "#ffffff",
  tableHeaderBg: "#f3f4f6",
  tableRowAlternateBg: "#f9fafb",
  tableBorder: "#e5e7eb",
  tableText: "#111827",
  tableHoverBg: "#f0f1f3",

  // Form / Input
  formBg: "#ffffff",
  formBorder: "#d1d5db",
  formText: "#111827",
  formPlaceholder: "#9ca3af",

  // Dropdown
  dropdownBg: "#ffffff",
  dropdownBorder: "#e5e7eb",
  dropdownText: "#111827",
  dropdownHoverBg: "#f3f4f6",
  dropdownHoverText: "#000000",

  // Button (default secondary style)
  buttonBg: "#ffffff",
  buttonBorder: "#d1d5db",
  buttonText: "#111827",
  buttonHoverBg: "#f3f4f6",
};

const dark = {
  appBackground: "#191f25",
  appNavbar: "#252f3e",
  textPrimary: "#ffffff",

  edit: "#2563eb",
  editForeground: "#ffffff",
  destructive: "#ef4444",
  destructiveForeground: "#ffffff",
  primary: "#3b82f6",
  primaryForeground: "#ffffff",

  tableBg: "#1f2937",
  tableHeaderBg: "#111827",
  tableRowAlternateBg: "#111827",
  tableBorder: "#374151",
  tableText: "#f3f4f6",
  tableHoverBg: "#374151",

  formBg: "#1f2937",
  formBorder: "#4b5563",
  formText: "#f3f4f6",
  formPlaceholder: "#9ca3af",

  dropdownBg: "#1f2937",
  dropdownBorder: "#374151",
  dropdownText: "#f3f4f6",
  dropdownHoverBg: "#374151",
  dropdownHoverText: "#ffffff",

  buttonBg: "#374151",
  buttonBorder: "#4b5563",
  buttonText: "#f3f4f6",
  buttonHoverBg: "#4b5563",
};

/** camelCase -> kebab-case for CSS variable names */
function toCssVarName(key) {
  return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/** Build Tailwind theme colors that reference CSS variables (so theme switches from globals.css) */
function tailwindThemeFromVars(themeKeys) {
  return Object.fromEntries(
    themeKeys.map((key) => [key, `var(--${toCssVarName(key)})`])
  );
}

const themeKeys = Object.keys(light);

/** For Tailwind config: use these so classes like bg-appBackground follow CSS variables */
const tailwindColors = tailwindThemeFromVars(themeKeys);

/** For generating or syncing globals.css - light theme values */
const cssLightVars = Object.fromEntries(
  themeKeys.map((k) => [toCssVarName(k), light[k]])
);

/** For generating or syncing globals.css - dark theme values */
const cssDarkVars = Object.fromEntries(
  themeKeys.map((k) => [toCssVarName(k), dark[k]])
);

module.exports = {
  light,
  dark,
  tailwindColors,
  themeKeys,
  cssLightVars,
  cssDarkVars,
  toCssVarName,
  // Legacy / convenience
  app_background: dark.appBackground,
  app_navbar: dark.appNavbar,
  edit: light.edit,
  editForeground: light.editForeground,
  destructive: light.destructive,
  destructiveForeground: light.destructiveForeground,
  appPrimary: light.primary,
};