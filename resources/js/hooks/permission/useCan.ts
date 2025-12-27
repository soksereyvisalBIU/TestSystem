import { usePage } from '@inertiajs/react'

export function useCan(permission: string): boolean {
    const { props } = usePage<any>()

    return props.auth?.can?.[permission] === true
}
