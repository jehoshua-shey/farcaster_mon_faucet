'use client';

import { useEffect, useState } from 'react';
import oneTimeClaimAbi from '../abis/OneTimeClaim.json';
import React from 'react';

import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";


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
  const [hasClaim, setHasClaim] = useState<boolean | null>(null);
  const [txnHash, setTxnHash] = useState() as any
  const [isClaiming, setIsClaiming] = useState(false);
  const [errormsg, setErrormsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [claimRes, setClaimRes] = useState() as any

  const { isEthProviderAvailable } = useMiniAppContext();
  const { isConnected, address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: hash, sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();
  const { connect } = useConnect();
  const { data, isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: txnHash,       // hash from writeContractAsync
    chainId: monadTestnet.id,
    confirmations: 1,   // optional: wait for 1 confirmation
  });
  const {
    writeContractAsync,
    isPending,
    error,
    data: txHash
  } = useWriteContract();
  const {
    data: hasClaimed,
  }: any = useReadContract({
    abi: oneTimeClaimAbi,
    address: CONTRACT_ADDRESS,
    functionName: 'hasClaimed',
    args: [address],
  })

console.log(hasClaimed)

  // Initialize public client


  // Check txn status


  // Connect wallet

  // Switch to Monad testnet

  // Check claim status

  useEffect(() => {
      setHasClaim(hasClaimed)
  }, [hasClaimed])


  // Handle claim
  const handleClaim = async () => {

    if (!isConnected) {
      setErrormsg('Wallet not connected');
      return;
    }
    setIsClaiming(true);
    setErrormsg(null);

    try {
      switchChain({ chainId: monadTestnet.id });

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: oneTimeClaimAbi,
        functionName: 'claim',
        chainId: monadTestnet.id,
        account: address,
      });

      if (hash) {
        setTxnHash(hash)
      } else {
        setErrormsg('Transaction failed');
      }

      console.log('Transaction Hash:', hash);
    } catch (err: any) {
      setErrormsg('Claim failed: ' + (err.message || 'Unknown errormsg'));
      console.error(err);
    } finally {
      setIsClaiming(false);
    }
  };


  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Claim 0.1 MON</h1>
      {!address ? (
        <button onClick={() => connect({ connector: farcasterFrame() })}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected Address: {address}</p>
          {hasClaim === null ? (
            <React.Fragment>
              <p>Checking claim status...</p>
            </React.Fragment>
          ) : hasClaim ? (
            <p>You have already claimed 0.1 MON.</p>
          ) : (
            <button onClick={handleClaim} disabled={isClaiming}>
              {isClaiming ? 'Claiming...' : 'Claim 0.1 MON'}
            </button>
          )}
          {success && <p>Claim successful!</p>}
          {errormsg && <p>Errormsg: {errormsg}</p>}
        </>
      )}
    </div>
  );
}