import { useEffect, useState } from 'react';

/**
 * Custom hook to debounce rapid state changes (e.g., search inputs).
 * Reduces server load and prevents UI flickering.
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}