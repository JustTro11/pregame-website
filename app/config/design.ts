/**
 * PreGame Coffee Shop - Design Tokens
 * 
 * Centralized design system configuration.
 * Easy to update when we get Instagram brand reference.
 * 
 * Current Theme: Dark Streetwear with Warm Amber Accents
 */

export const designTokens = {
    colors: {
        // Backgrounds
        background: {
            primary: '#0A0A0A',    // Near black - main background
            secondary: '#1A1A1A',  // Dark gray - sections
            card: '#141414',       // Card backgrounds
            elevated: '#1F1F1F',   // Elevated elements
        },

        // Accent colors
        accent: {
            primary: '#E8A849',    // Warm amber - CTAs, links
            secondary: '#D4943F',  // Darker amber - hover states
            tertiary: '#C47F2E',   // Even darker - active states
        },

        // Text colors
        text: {
            primary: '#FFFFFF',    // Main text
            secondary: '#A0A0A0',  // Muted text
            muted: '#666666',      // Very muted
            inverse: '#0A0A0A',    // Text on light backgrounds
        },

        // Semantic colors
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',

        // Border colors
        border: {
            default: '#2A2A2A',
            hover: '#3A3A3A',
            focus: '#E8A849',
        },
    },

    // Font families (loaded via Google Fonts)
    fonts: {
        heading: '"Outfit", "Noto Sans TC", sans-serif',
        body: '"Inter", "Noto Sans TC", sans-serif',
        mono: '"JetBrains Mono", monospace',
    },

    // Font sizes (in rem)
    fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
    },

    // Spacing scale
    spacing: {
        px: '1px',
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
    },

    // Border radius
    radius: {
        none: '0',
        sm: '0.25rem',
        default: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
    },

    // Shadows
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
        default: '0 4px 6px rgba(0, 0, 0, 0.4)',
        md: '0 6px 12px rgba(0, 0, 0, 0.5)',
        lg: '0 10px 25px rgba(0, 0, 0, 0.6)',
        glow: '0 0 20px rgba(232, 168, 73, 0.3)', // Amber glow
    },

    // Transitions
    transitions: {
        fast: '150ms ease',
        default: '200ms ease',
        slow: '300ms ease',
        bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },

    // Glassmorphism effect
    glass: {
        background: 'rgba(20, 20, 20, 0.8)',
        backdropBlur: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
} as const;

export type DesignTokens = typeof designTokens;
