import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#C80AD5', // Fucsia
          secondary: '#320039', // Morado oscuro
          accent: '#310346', // Morado intermedio
          neutral: '#EBE5EA', // Gris claro
          'base-100': '#FEFEFE', // Fondo blanco
          'base-200': '#F5F5F5', // Fondo ligeramente más oscuro
          'base-300': '#E0E0E0', // Líneas y bordes claros
          'base-content': '#1F2937', // Texto principal oscuro
          info: '#93E6FB', // Azul para información
          success: '#81E6D9', // Verde para éxito
          warning: '#FBBF24', // Amarillo para advertencias
          error: '#F87171', // Rojo para errores
        },
      },
      {
        dark: {
          primary: '#C80AD5', // Fucsia
          secondary: '#320039', // Morado oscuro
          accent: '#310346', // Morado intermedio
          neutral: '#320039', // Fondo oscuro (similar al secundario)
          'base-100': '#1E1E1E', // Fondo principal oscuro
          'base-200': '#2A2A2A', // Fondo ligeramente más claro
          'base-300': '#3A3A3A', // Bordes oscuros
          'base-content': '#EBE5EA', // Texto principal claro
          info: '#3ABFF8', // Azul para información
          success: '#36D399', // Verde para éxito
          warning: '#FBBD23', // Amarillo para advertencias
          error: '#F87272', // Rojo para errores
        },
      },
    ],
  },
} satisfies Config;
