import React from 'react'

export function Widget({title, icon, children} : {title: string, icon: React.ReactNode, children: React.ReactNode}) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="tracking-tight text-sm font-medium">
                    {title}
                </div>
                {icon}
            </div>
            <div className="p-6 pt-0">
                <div className="text-2xl font-bold">
                    {children}
                </div>
            </div>
        </div>
    )
}