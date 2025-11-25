import { AppSidebar } from '@/components/app-sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppNavbar } from '@/components/app-navbar';
import { Toaster } from '@/components/ui/toaster';
import React from 'react'

export default function AppLayout({children} : {children: React.ReactNode}) {
    return (
        <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
            <SidebarProvider>
                <AppSidebar/>
                <main className='w-full overflow-x-hidden'>
                    <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
                        <AppNavbar/>
                    </header>
                    <div>{children}</div>
                    <Toaster/>
                </main>
            </SidebarProvider>
        </ThemeProvider>
    )
}