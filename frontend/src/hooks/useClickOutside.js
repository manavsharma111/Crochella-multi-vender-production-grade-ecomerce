import { useEffect, useRef } from 'react'

// use click outside hook
const useClickOutside = (ref, handler) => {
    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        const listener = (event) => {
            // check if click is outside of the ref
            if (!ref.current || ref.current.contains(event.target)) {
                return
            }
            handlerRef.current(event)
        }

        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)

        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [ref])
}

export default useClickOutside
