import ClaimButton from '@/components/ClaimButton';

export default function Home() {
  return (
    <main>
      <ClaimButton />
    </main>
  );
}

export const metadata = {
  other: {
    'fc:frame': 'next',
    'fc:frame:image': 'https://farcaster-mon-faucet.vercel.app/image.png',
    'fc:frame:button:1': 'Claim MON',
    'fc:frame:button:1:action': 'launch_frame',
    'fc:frame:button:1:target': 'https://farcaster-mon-faucet.vercel.app/',
    'fc:frame:button:1:name': 'Monverge Free MON Faucet', // Optional: App name
    'fc:frame:button:1:splashImageUrl': 'https://farcaster-mon-faucet.vercel.app/splash.png', // Optional: Splash image
    'fc:frame:button:1:splashBackgroundColor': '#ffffff', // Optional: Splash background color
  },
};