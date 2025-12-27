import { Head } from '@inertiajs/react'

export default function Error404() {
    return (
        <>
            <Head title="404 Not Found" />

            <div className="min-h-screen flex flex-col items-center justify-center text-center">
                <h1 className="text-6xl font-bold">404</h1>
                <p className="mt-4 text-gray-600">
                    Sorry, the page you are looking for could not be found.
                </p>
            </div>
        </>
    )
}
