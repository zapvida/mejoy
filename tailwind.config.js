/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ["class"],
  theme: {
    // Container responsivo perfeito
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    
    // Breakpoints mobile-first otimizados
    screens: {
      'xs': '360px',    // Mobile mínimo
      'sm': '640px',    // Mobile grande
      'md': '768px',    // Tablet
      'lg': '1024px',   // Desktop pequeno
      'xl': '1280px',   // Desktop
      '2xl': '1536px',  // Desktop grande
      
      // viewport curtos (ex.: 300x600)
      'short': {'raw': '(max-height: 600px)'},
      'vshort': {'raw': '(max-height: 520px)'},
    },
    
    extend: {
      // Sistema de cores Alloe Health
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--brand-600))",
        
        // Tokens semânticos unificados
        primary: "hsl(var(--brand-600))",
        accent: "hsl(var(--brand-600))",
        
        // Verde Alloe perfeito extraído do logo
        brand: {
          DEFAULT: "hsl(var(--brand))",
          50: "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          300: "hsl(var(--brand-300))",
          400: "hsl(var(--brand-400))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
          800: "hsl(var(--brand-800))",
          900: "hsl(var(--brand-900))",
        },
        
        // Compatibilidade com componentes existentes
        primary: {
          DEFAULT: "hsl(var(--brand))",
          50: "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          300: "hsl(var(--brand-300))",
          400: "hsl(var(--brand-400))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
          800: "hsl(var(--brand-800))",
          900: "hsl(var(--brand-900))",
        },
        
        // Tokens de acessibilidade
        destructive: {
          DEFAULT: "hsl(var(--foreground))",
          foreground: "hsl(var(--background))",
        },
        success: {
          DEFAULT: "hsl(var(--brand))",
          foreground: "hsl(var(--background))",
        },
      },
      
      // Espaçamento responsivo
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      
      // Tipografia responsiva
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // Grid responsivo
      gridTemplateColumns: {
        'auto-fit-xs': 'repeat(auto-fit, minmax(280px, 1fr))',
        'auto-fit-sm': 'repeat(auto-fit, minmax(320px, 1fr))',
        'auto-fit-md': 'repeat(auto-fit, minmax(350px, 1fr))',
        'auto-fit-lg': 'repeat(auto-fit, minmax(400px, 1fr))',
      },
      
      // Animações responsivas
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'pulse-green': 'pulse-green 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      
      // Z-index system
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      height: {
        '80': '20rem', // Altura padrão dos cards
        '96': '24rem',
      },
      
      width: {
        '80': '20rem',
        '96': '24rem',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 255, 0, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(0, 255, 0, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceSubtle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' },
        },
      },
      
      backdropBlur: {
        xs: '2px',
      },
      
      boxShadow: {
        'green': '0 4px 14px 0 rgba(0, 255, 0, 0.39)',
        'green-lg': '0 10px 25px -3px rgba(0, 255, 0, 0.1), 0 4px 6px -2px rgba(0, 255, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
