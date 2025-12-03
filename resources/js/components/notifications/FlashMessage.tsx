import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
export default function FlashMessage() {
    const { flash }: any = usePage().props;
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, { duration: 3000, position: 'top-right' });
        }
        if (flash?.error) {
            toast.error(flash.error, { duration: 3000, position: 'top-right' });
        }
    }, [flash]);
    return null;
}
