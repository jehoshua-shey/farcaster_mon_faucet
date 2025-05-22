import ClaimButton from '@/components/ClaimButton';
import { Metadata } from "next";

const APP_URL = "https://farcaster-mon-faucet.vercel.app"

const frame = {
  version: "next",
  imageUrl: `${APP_URL}/image.png`,
  button: {
    title: "Claim $MON",
    action: {
      type: "launch_frame",
      name: "Monverge Free MON Faucet",
      url: APP_URL,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: "#000000",
    },
  },
};

export default function Home() {
  return (
    <main>
      <ClaimButton />
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}