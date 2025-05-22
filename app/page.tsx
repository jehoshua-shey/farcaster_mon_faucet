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
    'fc:frame:image': 'https://yourdomain.com/og-image.png',
    'fc:frame:button:1': 'Claim MON',
    'fc:frame:button:1:action': 'launch_frame',
    'fc:frame:button:1:target': 'https://yourdomain.com/',
  },
};