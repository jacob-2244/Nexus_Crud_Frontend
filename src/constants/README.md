# Color constants

All theme colors are defined in **`color.js`** as the single source of truth.

## Changing colors

1. Edit **`src/constants/color.js`**:
   - `light` – default/light theme values
   - `dark` – dark theme values (when `class="dark"` is on `<html>`)

2. Sync CSS variables into `globals.css`:
   ```bash
   npm run sync:colors
   ```
   This updates the `:root` and `.dark` blocks in `src/app/globals.css` from `color.js`.

## How it’s used

- **Tailwind** – `tailwind.config.js` uses `tailwindColors` from `color.js`, so utilities like `bg-appBackground`, `text-primary`, `bg-primary` use the same CSS variables and switch with the theme.
- **Global CSS** – `globals.css` uses `var(--app-background)`, `var(--form-bg)`, etc. for tables, forms, buttons, and dropdowns. Keep these in sync by running `npm run sync:colors` after editing `color.js`.
- **Layout** – The root layout uses `bg-[var(--app-background)]` so the page background follows the theme.

## Adding a new color

1. Add the key and value to both `light` and `dark` in `color.js` (camelCase, e.g. `cardBorder`).
2. Run `npm run sync:colors`.
3. Use in components as Tailwind classes: `bg-cardBorder`, `text-cardBorder`, `border-cardBorder`, etc., or in CSS as `var(--card-border)`.
