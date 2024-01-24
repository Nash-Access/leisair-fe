import { useCallback, useEffect, useRef } from "react";

const useDebouncedCallback = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
) => {
    const callbackRef = useRef(callback);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            if (typeof callbackRef.current === 'function') {
                callbackRef.current(...args);
            }
        }, delay);
    }, [delay]);
};

export default useDebouncedCallback;