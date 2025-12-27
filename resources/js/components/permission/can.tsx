import { PropsWithChildren } from 'react'
import { usePage } from '@inertiajs/react'

type CanProps = {
    permission: string
    fallback?: React.ReactNode
}

export default function Can({
    permission,
    children,
    fallback = null,
}: PropsWithChildren<CanProps>) {
    const { props } = usePage<any>()

    const can = props.auth?.can?.[permission] === true

    if (!can) return <>{fallback}</>

    return <>{children}</>
}
