// import { usePage } from '@inertiajs/react'
// import { useEffect, useRef } from 'react'
// import toast from 'react-hot-toast'

// export default function FlashMessage() {
//     const { flash }: any = usePage().props

//     const lastMessage = useRef<string | null>(null)

//     useEffect(() => {
//         if (flash?.success && flash.success !== lastMessage.current) {
//             lastMessage.current = flash.success
//             toast.success(flash.success, { duration: 3000, position: 'top-right' })
//         }

//         if (flash?.error && flash.error !== lastMessage.current) {
//             lastMessage.current = flash.error
//             toast.error(flash.error, { duration: 3000, position: 'top-right' })
//         }
//     }, [flash])

//     return null
// }

import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export default function FlashMessage() {
    // Specify the shape of your flash props for better type safety
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    // Use a ref to keep track of the last shown message to prevent duplicates
    const shownMessage = useRef<string | null>(null);

    useEffect(() => {
        const message = flash?.success || flash?.error;
        const type = flash?.success ? 'success' : 'error';

        // 1. If there is no message, reset the "shown" tracker and exit
        if (!message) {
            shownMessage.current = null;
            return;
        }

        // 2. If the current flash message is different from the last one we showed
        if (message !== shownMessage.current) {
            shownMessage.current = message;

            if (type === 'success') {
                toast.success(message, { duration: 3000, position: 'top-right' });
            } else {
                toast.error(message, { duration: 3000, position: 'top-right' });
            }
        }
    }, [flash]); // Re-run whenever the flash object changes

    return null;
}