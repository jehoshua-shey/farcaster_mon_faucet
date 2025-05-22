import type { Metadata } from 'next';
import '@/styles/globals.css';

import { sdk } from '@farcaster/frame-sdk'
 
await sdk.actions.ready();

export const metadata: Metadata = {
    title: 'Claim free mon from Monverge',
    description: 'Claim 0.1 MON on Monad Testnet',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}