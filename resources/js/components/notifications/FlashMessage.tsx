import { usePage } from '@inertiajs/react'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export default function FlashMessage() {
    const { flash }: any = usePage().props

    const lastMessage = useRef<string | null>(null)

    useEffect(() => {
        if (flash?.success && flash.success !== lastMessage.current) {
            lastMessage.current = flash.success
            toast.success(flash.success, { duration: 3000, position: 'top-right' })
        }

        if (flash?.error && flash.error !== lastMessage.current) {
            lastMessage.current = flash.error
            toast.error(flash.error, { duration: 3000, position: 'top-right' })
        }
    }, [flash])

    return null
}
