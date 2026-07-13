/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
        "surface-gray": "#F8FAFC",
        "primary-fixed-dim": "#bae6fd",
        "on-tertiary-container": "#711419",
        "inverse-primary": "#bae6fd",
        "secondary-container": "#e0f2fe",
        "error-container": "#ffdad6",
        "outline": "#0284c7",
        "secondary-fixed": "#bae6fd",
        "surface-dim": "#bae6fd",
        "on-secondary": "#ffffff",
        "tertiary-fixed-dim": "#ffb3af",
        "on-tertiary": "#ffffff",
        "surface-container": "#F8FAFC",
        "surface-container-highest": "#e0f2fe",
        "surface-bright": "#f0f9ff",
        "error": "#ba1a1a",
        "on-primary": "#ffffff",
        "surface-container-high": "#f0f9ff",
        "on-surface": "#075985",
        "outline-variant": "#bae6fd",
        "surface-container-lowest": "#ffffff",
        "background": "#FFFFFF",
        "primary-fixed": "#bae6fd",
        "on-secondary-fixed-variant": "#0369a1",
        "status-amber": "#F59E0B",
        "primary": "#0284c7", // Vibrant Blue
        "on-surface-variant": "#0369a1",
        "surface-container-low": "#f0f9ff",
        "tertiary-fixed": "#ffdad7",
        "border-light": "#e0f2fe",
        "tertiary": "#a43a3a",
        "surface-tint": "#0284c7",
        "on-secondary-fixed": "#075985",
        "secondary": "#0d9488", // Vibrant Teal
        "surface-variant": "#e0f2fe",
        "on-secondary-container": "#0369a1",
        "on-primary-fixed": "#075985",
        "inverse-on-surface": "#f0f9ff",
        "on-primary-container": "#075985",
        "on-tertiary-fixed": "#410005",
        "on-error": "#ffffff",
        "on-tertiary-fixed-variant": "#842225",
        "status-red": "#EF4444",
        "on-primary-fixed-variant": "#0369a1",
        "secondary-fixed-dim": "#bae6fd",
        "primary-container": "#e0f2fe", // Soft sky blue
        "inverse-surface": "#075985",
        "tertiary-container": "#fc7c78",
        "surface": "#FFFFFF",
        "on-background": "#075985",
        "on-error-container": "#93000a",
        "teal": {
          "50": "#f0f9ff",      // Soft sky blue (very cheerful)
          "100": "#e0f2fe",     // Light blue
          "200": "#bae6fd",
          "300": "#7dd3fc",
          "400": "#38bdf8",
          "500": "#0ea5e9",     // Bright Sky Blue
          "600": "#0284c7",     // Vibrant Blue-Teal brand color
          "700": "#0369a1",     // Deep Blue hover
          "800": "#075985",
          "900": "#0c4a6e"
        }
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      "spacing": {
        "container-max": "1440px",
        "sidebar-width": "260px",
        "base": "4px",
        "margin-mobile": "16px",
        "gutter": "24px"
      },
      "fontFamily": {
        "display-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-sm": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"]
      },
      "fontSize": {
        "display-lg": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "headline-md": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "label-sm": ["11px", { "lineHeight": "14px", "fontWeight": "500" }],
        "headline-sm": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
        "body-sm": ["13px", { "lineHeight": "18px", "fontWeight": "400" }]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
