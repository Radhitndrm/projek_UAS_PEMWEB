import { ThemeProvider } from '@/components/theme-provider'
import React from 'react'

export default function AuthLayout({children} : {children: React.ReactNode}) {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className='flex flex-col items-center min-h-screen justify-center px-2 md:px-0'>
                {children}
            </div>
        </ThemeProvider>
    )
}