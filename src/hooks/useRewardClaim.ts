import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveAccount, useSendAndConfirmTransaction } from 'thirdweb/react';
import { prepareContractCall, readContract } from 'thirdweb';
import { balanceOf as erc721BalanceOf } from 'thirdweb/extensions/erc721';
import { formatUnits } from 'ethers';

import {
  farmNftContract,
  earlyBirdContract,
  galxeVoteNftContract,
  multiNFTRewardContract,
  hashcoinContract,
} from '../utils/contracts';

export function useRewardClaim() {
  const account = useActiveAccount();
  const queryClient = useQueryClient();
  const { mutateAsync: sendAndConfirm } = useSendAndConfirmTransaction();
  const accountAddress = account?.address;

  const queries = useQueries({
    queries: [
      {
        queryKey: ['rewardClaim', 'farmBalance', accountAddress],
        queryFn: () => erc721BalanceOf({ contract: farmNftContract, owner: accountAddress! }),
        enabled: !!accountAddress,
        staleTime: 300_000,
      },
      {
        queryKey: ['rewardClaim', 'earlyBirdBalance', accountAddress],
        queryFn: () => erc721BalanceOf({ contract: earlyBirdContract, owner: accountAddress! }),
        enabled: !!accountAddress,
        staleTime: 300_000,
      },
      {
        queryKey: ['rewardClaim', 'galxeVoteBalance', accountAddress],
        queryFn: () => erc721BalanceOf({ contract: galxeVoteNftContract, owner: accountAddress! }),
        enabled: !!accountAddress,
        staleTime: 300_000,
      },
      {
        queryKey: ['rewardClaim', 'hasClaimed', accountAddress],
        queryFn: () => readContract({ contract: multiNFTRewardContract, method: 'claimed', params: [accountAddress!] }),
        enabled: !!accountAddress,
        staleTime: 300_000,
      },
      {
        queryKey: ['rewardClaim', 'rewardAmount'],
        queryFn: () => readContract({ contract: multiNFTRewardContract, method: 'rewardAmount', params: [] }),
        staleTime: Infinity,
      },
      {
        queryKey: ['rewardClaim', 'poolRewardBalance'],
        queryFn: () => readContract({ 
          contract: hashcoinContract, 
          method: 'balanceOf', 
          params: [multiNFTRewardContract.address] 
        }),
        staleTime: 300_000,
      },
    ],
  });

  const [farmResult, earlyResult, galxeResult, claimedResult, amountResult, poolBalanceResult] = queries;

  const isLoading = queries.some((q) => q.isLoading);

  const hasFarmNft = (farmResult.data || 0n) > 0n;
  const hasEarlyBird = (earlyResult.data || 0n) > 0n;
  const hasGalxeVote = (galxeResult.data || 0n) > 0n;
  const hasClaimed = claimedResult.data ?? false;

  const canClaim = hasFarmNft && hasEarlyBird && hasGalxeVote && !hasClaimed;

  const rewardAmount = amountResult.data
    ? formatUnits(amountResult.data, 18)
    : '4000';

  const poolRewardBalance = poolBalanceResult.data
    ? parseFloat(formatUnits(poolBalanceResult.data, 18)).toLocaleString()
    : '0';

  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!account) throw new Error('Please connect wallet.');
      if (!canClaim) throw new Error('You are not eligible to claim this reward.');

      const tx = prepareContractCall({
        contract: multiNFTRewardContract,
        method: 'claim',
        params: [],
      });
      return await sendAndConfirm(tx);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardClaim'] });
      queryClient.invalidateQueries({ queryKey: [hashcoinContract.chain.id, hashcoinContract.address] });
    },
    onError: (error: Error) => {
      console.error('Reward claim failed', error);
    },
  });

  return {
    isLoading,
    hasFarmNft,
    hasEarlyBird,
    hasGalxeVote,
    canClaim,
    hasClaimed,
    rewardAmount,
    poolRewardBalance,
    isClaiming: claimMutation.isPending,
    handleClaim: () => claimMutation.mutate(),
    error: claimMutation.error,
  };
}
