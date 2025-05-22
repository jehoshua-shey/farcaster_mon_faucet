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
    'fc:frame': 'vNext', // Use 'vNext' for latest Farcaster Frame version
    'fc:frame:image': 'https://farcaster-mon-faucet.vercel.app/image.png', // Image for Frame (3:2 ratio, e.g., 1200x800)
    'fc:frame:image:aspect_ratio': '1.91:1', // Recommended for consistent rendering
    'fc:frame:button:1': 'Claim $MON', // Button text
    'fc:frame:button:1:action': 'link', // Changed to 'link' for external URL
    'fc:frame:button:1:target': 'https://farcaster-mon-faucet.vercel.app/', // URL to open Mini App
    'fc:frame:name': 'Monverge Free MON Faucet', // App name
    'fc:frame:splashImageUrl': 'https://farcaster-mon-faucet.vercel.app/splash.png', // Splash image
    'fc:frame:splashBackgroundColor': '#000000', // Splash background color
  },
};