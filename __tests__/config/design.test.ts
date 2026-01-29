import { designTokens } from '@/app/config/design';

describe('Design Config', () => {
    it('should match snapshot', () => {
        expect(designTokens).toBeDefined();
        expect(designTokens.colors.background.primary).toBe('#0A0A0A');
        expect(designTokens.fonts.heading).toContain('Outfit');
    });
});
