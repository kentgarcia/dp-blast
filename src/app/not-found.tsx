import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Not Found',
    description: 'Page not found',
}

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">Page Not Found</h2>
                <p className="text-blue-600 mb-4">Could not find the requested page.</p>
                <Link href="/" className="text-blue-600 hover:text-blue-700 underline">
                    Return Home
                </Link>
            </div>
        </div>
    )
}
