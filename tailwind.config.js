/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {'visual-bg-dark': '#1a202c', // Example: a very dark background, maybe replace gray-900 later
        'visual-canvas-bg': '#2d3748', // Example: slightly lighter dark for canvas
        'custom-primary': '#a3c4f3', // A soft blue from your palette
        'custom-secondary': '#90dbf4', // Another light blue/cyan
        'custom-accent': '#f1c0e8',   // A pastel pink/purple for highlights
        'custom-sorted': '#98f5e1',   // A light green/aqua for sorted elements
        'custom-compare': '#fde4cf',  // A soft orange/peach for comparing elements
        'custom-swap': '#ffcfd2',     // A light red/pink for swapping elements
        'text-light': '#fbf8cc'
      }
  },
  },
  plugins: [],
}
