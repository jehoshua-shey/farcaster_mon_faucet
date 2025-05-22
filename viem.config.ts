import { defineChain } from 'viem';

export const monadTestnet = defineChain({
  id: 12345, // Replace with actual Monad testnet chain ID
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] }, // Replace with actual RPC URL
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
});