// app/routes/__root.tsx
import type { ReactNode } from 'react';

import {
    createRootRoute,
    HeadContent,
    Outlet,
    Scripts
} from '@tanstack/react-router';

import { Header } from '@/components/header';
import appCss from '@/styles/app.css?url';

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                title: 'Robodoc Start'
            },
            {
                name: 'description',
                content:
                    'Deep Libras is a platform to translate Libras to Portuguese.'
            }
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss
            }
        ]
    }),
    component: RootComponent
});

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html>
            <head>
                <HeadContent />
            </head>

            <body className="min-h-dvh w-dvw">
                <Header />

                <main className="mx-auto flex w-full max-w-5xl flex-col gap-2 p-4 pt-[65px]">
                    {children}
                </main>

                <Scripts />
            </body>
        </html>
    );
}
