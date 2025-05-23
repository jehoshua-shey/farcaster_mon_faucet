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
  const [hasClaimed, setHasClaimed] = useState<boolean | null>(null);
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



  // Initialize public client


  // Check txn status
  useEffect(() => {
    if (isSuccess) {
      setSuccess(true);
      setHasClaimed(true);
    }
    else if (isError) {
      setErrormsg('Transaction failed');
    }
  }, [hash]);

  // Connect wallet

  // Switch to Monad testnet

  // Check claim status
  useEffect(() => {
    if (address) {
      try {
        const result = useReadContract({
          abi: oneTimeClaimAbi,
          address: CONTRACT_ADDRESS,
          functionName: 'hasClaimed',
          args: [address],
        })

        setClaimRes(result)

        if (result) {
          setHasClaimed(true)
          alert(result)
        } else {
          alert(result)
          setHasClaimed(false)
          setErrormsg('Failed to check claim status');
        }
      } catch (error: any) {
        console.error(error);
      }
    }
  }, [address]);



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
          {hasClaimed === null ? (
            <React.Fragment>
              <p>{claimRes}</p>
              <p>{claimRes}</p>
            </React.Fragment>
          ) : hasClaimed ? (
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