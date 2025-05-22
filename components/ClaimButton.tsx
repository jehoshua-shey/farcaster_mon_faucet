'use client';

import { useEffect, useState } from 'react';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import oneTimeClaimAbi from '../abis/OneTimeClaim.json';


const CONTRACT_ADDRESS = '0xDE6A62F2d7EE3e835239d626B2430B0726EABBAd';

const monadTestnet = {
  id: 10143, // Chain ID
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    name: 'MONAD',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com/',
    },
  },
};

export default function ClaimButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [hasClaimed, setHasClaimed] = useState<boolean | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [walletClient, setWalletClient] = useState<ReturnType<typeof createWalletClient> | null>(null);

  // Initialize public client
  const publicClient = createPublicClient({
    chain: monadTestnet,
    transport: http(),
  });

  // Initialize wallet client in browser
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const client = createWalletClient({
        chain: monadTestnet,
        transport: custom(window.ethereum),
      });
      setWalletClient(client);
    }
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('No wallet provider found. Please install MetaMask or use Warpcast.');
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
    } catch (err: any) {
      setError('Failed to connect wallet: ' + (err.message || 'Unknown error'));
    }
  };

  // Switch to Monad testnet
  const switchChain = async () => {
    try {
      if (!window.ethereum) return false;
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${monadTestnet.id.toString(16)}` }],
      });
    } catch (err: any) {
      if (err.code === 4902 && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${monadTestnet.id.toString(16)}`,
              chainName: monadTestnet.name,
              nativeCurrency: monadTestnet.nativeCurrency,
              rpcUrls: monadTestnet.rpcUrls.default.http,
            },
          ],
        });
      } else {
        setError('Failed to switch chain: ' + (err.message || 'Unknown error'));
      }
    }
  };

  // Check claim status
  useEffect(() => {
    if (address) {
      publicClient
        .readContract({
          address: CONTRACT_ADDRESS,
          abi: oneTimeClaimAbi,
          functionName: 'hasClaimed',
          args: [address],
        })
        .then((result: any) => setHasClaimed(result))
        .catch((err) => {
          setError('Failed to check claim status');
          console.error(err);
        });
    }
  }, [address]);

  // Handle claim
  const handleClaim = async () => {
    if (!address || !walletClient) {
      setError('Wallet not connected');
      return;
    }
    setIsClaiming(true);
    setError(null);
    try {
      await switchChain();
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: oneTimeClaimAbi,
        functionName: 'claim',
        account: `0x${address.slice(2)}`, // Fixed: Removed `0x${address}`
      });
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: oneTimeClaimAbi,
        functionName: 'claim',
        account: `0x${address.slice(2)}`, // Fixed: Removed `0x${address}`
        chain: monadTestnet,
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status === 'success') {
        setSuccess(true);
        setHasClaimed(true);
      } else {
        setError('Transaction failed');
      }
    } catch (err: any) {
      setError('Claim failed: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Claim 0.1 MON</h1>
      {!address ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected Address: {address}</p>
          {hasClaimed === null ? (
            <p>Checking claim status...</p>
          ) : hasClaimed ? (
            <p>You have already claimed 0.1 MON.</p>
          ) : (
            <button onClick={handleClaim} disabled={isClaiming}>
              {isClaiming ? 'Claiming...' : 'Claim 0.1 MON'}
            </button>
          )}
          {success && <p>Claim successful!</p>}
          {error && <p>Error: {error}</p>}
        </>
      )}
    </div>
  );
}