import { cn } from '@/lib/utils';

describe('utils', () => {
    describe('cn', () => {
        it('merges class names correctly', () => {
            const result = cn('c1', 'c2');
            expect(result).toBe('c1 c2');
        });

        it('handles conditional classes', () => {
            const result = cn('c1', true && 'c2', false && 'c3');
            expect(result).toBe('c1 c2');
        });

        it('merges tailwind classes', () => {
            // twMerge should override conflicting classes
            const result = cn('px-2 py-1', 'p-4');
            expect(result).toBe('p-4');
        });
    });
});
