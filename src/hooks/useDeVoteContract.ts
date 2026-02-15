import { useState, useCallback, useMemo } from 'react';
import { useActiveAccount, useSendAndConfirmTransaction } from 'thirdweb/react';
import { prepareContractCall, toWei, readContract } from 'thirdweb';
import { devoteContract, hashcoinContract, ogNftContract, farmNftContract } from '../utils/contracts'; // Added ogNftContract, farmNftContract
import { useQueries, useQueryClient } from '@tanstack/react-query';
import type { ThirdwebContract } from 'thirdweb';

// Define Proposal type based on the Solidity struct
export type Proposal = {
  id: bigint;
  creator: string;
  title: string;
  description: string;
  endTime: bigint;
  forVotes: bigint;
  againstVotes: bigint;
  abstainVotes: bigint;
  rewardAmount: bigint;
  claimedAmount: bigint;
  voterCount: bigint;
  deleted: boolean;
  hasUserVoted: boolean;
  hasUserClaimed: boolean;
  userRewardAmount: bigint; // Added for individual user's reward
};

export type DeVoteStatus = 'idle' | 'pending' | 'success' | 'error';

// Helper function from optimization plan to structure queries
const createThirdwebQuery = ({
  contract,
  method,
  params = [],
  queryOptions = {},
}: {
  contract: ThirdwebContract;
  method: string;
  params?: unknown[];
  queryOptions?: object;
}) => {
  const queryKey = [contract.chain.id, contract.address, method, params];
  return {
    queryKey,
    queryFn: () => readContract({ contract, method, params }),
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
    ...queryOptions,
  };
};

export function useDeVoteContract() {
  const account = useActiveAccount();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<DeVoteStatus>('idle');
  const { mutateAsync: sendAndConfirm } = useSendAndConfirmTransaction();

  const accountAddress = account?.address || '0x0000000000000000000000000000000000000000';

  // State for pending transactions specific to proposal IDs
  const [creatingProposalPending, setCreatingProposalPending] = useState(false);
  const [votingPending, setVotingPending] = useState<Set<bigint>>(new Set());
  const [claimingPending, setClaimingPending] = useState<Set<bigint>>(new Set());

  const queries = useMemo(() => {
    return [
      // 0: HASH_TOKEN balance of user (for createProposal approval)
      createThirdwebQuery({
        contract: hashcoinContract,
        method: 'balanceOf',
        params: [accountAddress],
        queryOptions: { enabled: !!account?.address },
      }),
      // 1: HASH_TOKEN allowance for devoteContract (for createProposal approval)
      createThirdwebQuery({
        contract: hashcoinContract,
        method: 'allowance',
        params: [accountAddress, devoteContract.address],
        queryOptions: { enabled: !!account?.address },
      }),
      // 2: activeProposalsIds
      createThirdwebQuery({
        contract: devoteContract,
        method: 'getActiveProposals',
        params: [],
      }),
      // 3: finishedProposalsIds
      createThirdwebQuery({
        contract: devoteContract,
        method: 'getFinishedProposals',
        params: [],
      }),
      // 4: OG_NFT balance of user
      createThirdwebQuery({
        contract: ogNftContract,
        method: 'balanceOf',
        params: [accountAddress],
        queryOptions: { enabled: !!account?.address },
      }),
      // 5: FARM_NFT balance of user
      createThirdwebQuery({
        contract: farmNftContract,
        method: 'balanceOf',
        params: [accountAddress],
        queryOptions: { enabled: !!account?.address },
      }),
    ];
  }, [account?.address, accountAddress]);

  const queryResults = useQueries({
    queries,
    combine: (results) => {
      return {
        hashBalanceResult: results[0],
        hashAllowanceResult: results[1],
        activeProposalsIdsResult: results[2],
        finishedProposalsIdsResult: results[3],
        ogNftBalanceResult: results[4], // New result
        farmNftBalanceResult: results[5], // New result
        isLoading: results.some((res) => res.isLoading),
      };
    },
  });

  const {
    hashBalanceResult,
    hashAllowanceResult,
    activeProposalsIdsResult,
    finishedProposalsIdsResult,
    ogNftBalanceResult, // New destructuring
    farmNftBalanceResult, // New destructuring
    isLoading: areQueriesLoading,
  } = queryResults;

  const hashBalance = hashBalanceResult.data as bigint | undefined;
  const hashAllowance = hashAllowanceResult.data as bigint | undefined;
  const activeProposalsIds = activeProposalsIdsResult.data as bigint[] | undefined;
  const finishedProposalsIds = finishedProposalsIdsResult.data as bigint[] | undefined;

  // Process NFT balances to boolean status
  const hasOgNft = (ogNftBalanceResult.data as unknown as bigint || 0n) > 0n;
  const hasFarmNft = (farmNftBalanceResult.data as unknown as bigint || 0n) > 0n;

  const invalidateDevoteQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queries[0].queryKey }); // hashBalance
    queryClient.invalidateQueries({ queryKey: queries[1].queryKey }); // hashAllowance
    queryClient.invalidateQueries({ queryKey: queries[2].queryKey }); // activeProposalsIds
    queryClient.invalidateQueries({ queryKey: queries[3].queryKey }); // finishedProposalsIds
    queryClient.invalidateQueries({ queryKey: queries[4].queryKey }); // ogNftBalance
    queryClient.invalidateQueries({ queryKey: queries[5].queryKey }); // farmNftBalance
    queryClient.invalidateQueries({ queryKey: [devoteContract.chain.id, devoteContract.address, 'getProposal'] });
    queryClient.invalidateQueries({ queryKey: [devoteContract.chain.id, devoteContract.address, 'hasVoted'] });
    queryClient.invalidateQueries({ queryKey: [devoteContract.chain.id, devoteContract.address, 'hasClaimed'] });
  }, [queryClient, queries]);

  const createProposal = useCallback(
    async (title: string, description: string, rewardAmount: string) => {
      if (!account) throw new Error('Not connected');
      // No explicit OG_NFT check here yet, will be handled by UI disabled state
      setCreatingProposalPending(true);
      setStatus('pending');

      try {
        const rewardAmountWei = toWei(rewardAmount);

        // Check and approve HASH token if necessary
        if (hashAllowance === undefined || hashAllowance < rewardAmountWei) {
          const approveTx = prepareContractCall({
            contract: hashcoinContract,
            method: 'approve',
            params: [devoteContract.address, rewardAmountWei],
          });
          await sendAndConfirm(approveTx);
        }

        const tx = prepareContractCall({
          contract: devoteContract,
          method: 'createProposal',
          params: [title, description, rewardAmountWei],
        });
        await sendAndConfirm(tx);
        setStatus('success');
        invalidateDevoteQueries();
      } catch (err) {
        setStatus('error');
        console.error('Failed to create proposal:', err);
      } finally {
        setCreatingProposalPending(false);
      }
    },
    [account, sendAndConfirm, invalidateDevoteQueries, hashAllowance],
  );

  const vote = useCallback(
    async (proposalId: bigint, voteType: 0 | 1 | 2) => {
      if (!account) throw new Error('Not connected');
      // No explicit FARM_NFT check here yet, will be handled by UI disabled state
      setVotingPending((prev) => new Set(prev).add(proposalId));
      setStatus('pending');

      try {
        const tx = prepareContractCall({
          contract: devoteContract,
          method: 'vote',
          params: [proposalId, voteType],
        });
        await sendAndConfirm(tx);
        setStatus('success');
        invalidateDevoteQueries();
      } catch (err) {
        setStatus('error');
        console.error(`Failed to vote on proposal ${proposalId}:`, err);
      } finally {
        setVotingPending((prev) => {
          const next = new Set(prev);
          next.delete(proposalId);
          return next;
        });
      }
    },
    [account, sendAndConfirm, invalidateDevoteQueries],
  );

  const claimReward = useCallback(
    async (proposalId: bigint) => {
      if (!account) throw new Error('Not connected');
      // No explicit FARM_NFT check here yet, will be handled by UI disabled state
      setClaimingPending((prev) => new Set(prev).add(proposalId));
      setStatus('pending');

      try {
        const tx = prepareContractCall({
          contract: devoteContract,
          method: 'claimReward',
          params: [proposalId],
        });
        await sendAndConfirm(tx);
        setStatus('success');
        invalidateDevoteQueries();
      } catch (err) {
        setStatus('error');
        console.error(`Failed to claim reward for proposal ${proposalId}:`, err);
      } finally {
        setClaimingPending((prev) => {
          const next = new Set(prev);
          next.delete(proposalId);
          return next;
        });
      }
    },
    [account, sendAndConfirm, invalidateDevoteQueries],
  );

  // Helper function to fetch a single proposal and user voting status
  const getProposalAndUserStatus = useCallback(
    async (proposalId: bigint) => {
      try {
        // NOTE: We're not caching the readContract calls themselves with useQuery here
        // because we are composing them. Instead, we wrap the composite call
        // (getProposalAndUserStatus) in useQuery later on.
        const [proposalDataRaw, hasVoted, hasClaimed] = await Promise.all([
          readContract({
            contract: devoteContract,
            method: 'getProposal',
            params: [proposalId],
          }),
          account ? readContract({
            contract: devoteContract,
            method: 'hasVoted',
            params: [proposalId, account.address],
          }) as Promise<boolean> : Promise.resolve(false),
          account ? readContract({
            contract: devoteContract,
            method: 'hasClaimed',
            params: [proposalId, account.address],
          }) as Promise<boolean> : Promise.resolve(false),
        ]);
        const proposalObject = proposalDataRaw as {
          id: bigint;
          creator: string;
          title: string;
          description: string;
          endTime: bigint;
          forVotes: bigint;
          againstVotes: bigint;
          abstainVotes: bigint;
          rewardAmount: bigint;
          claimedAmount: bigint;
          voterCount: bigint;
          deleted: boolean;
        };

        const {
          id,
          creator,
          title,
          description,
          endTime,
          forVotes,
          againstVotes,
          abstainVotes,
          rewardAmount,
          claimedAmount,
          voterCount,
          deleted,
        } = proposalObject;

        const proposalData: Proposal = {
          id,
          creator,
          title,
          description,
          endTime,
          forVotes,
          againstVotes,
          abstainVotes,
          rewardAmount,
          claimedAmount,
          voterCount,
          deleted,
          hasUserVoted: hasVoted,
          hasUserClaimed: hasClaimed,
          userRewardAmount: voterCount > 0n ? rewardAmount / voterCount : 0n, // Calculate individual user reward
        };

        if (id === 1n) { // Check for proposal ID 1
          console.log("Proposal ID 1 details:", {
            id: proposalData.id.toString(),
            title: proposalData.title,
            endTime: proposalData.endTime.toString(),
            deleted: proposalData.deleted,
            currentTime: Math.floor(Date.now() / 1000),
            isEnded: Math.floor(Date.now() / 1000) > Number(proposalData.endTime),
          });
        }

        // The return shape is important for useQuery
        return { proposal: proposalData, hasVoted, hasClaimed };
      } catch (error) {
        console.error(`Error fetching proposal ${proposalId} or user status:`, error);
        return null;
      }
    },
    [account],
  );

  // --- NEW CACHING LOGIC ---

  // Create memoized queries for individual active proposals
  const activeProposalQueries = useMemo(() => {
    return (activeProposalsIds || []).map(id => ({
      queryKey: ['proposal', String(id), accountAddress], // Use string representation of BigInt in queryKey
      queryFn: () => getProposalAndUserStatus(id),
      staleTime: 1000 * 60, // 1 minute
      enabled: !!activeProposalsIds,
    }));
  }, [activeProposalsIds, getProposalAndUserStatus, accountAddress]);

  const activeProposalsResults = useQueries({ queries: activeProposalQueries });

  // Create memoized queries for individual finished proposals
  const finishedProposalQueries = useMemo(() => {
    return (finishedProposalsIds || []).map(id => ({
      queryKey: ['proposal', String(id), accountAddress],
      queryFn: () => getProposalAndUserStatus(id),
      staleTime: 1000 * 60 * 5, // 5 minutes for finished proposals
      enabled: !!finishedProposalsIds,
    }));
  }, [finishedProposalsIds, getProposalAndUserStatus, accountAddress]);

  const finishedProposalsResults = useQueries({ queries: finishedProposalQueries });

  // Process the results into final proposal arrays
  const activeProposals = useMemo(() => 
    activeProposalsResults
      .map(res => res.data?.proposal)
      .filter((p): p is Proposal => !!p && !p.deleted)
      .sort((a, b) => Number(b.endTime - a.endTime)), // Sort by newest first
    [activeProposalsResults]
  );

  const finishedProposals = useMemo(() => 
    finishedProposalsResults
      .map(res => res.data?.proposal)
      .filter((p): p is Proposal => !!p && !p.deleted)
      .sort((a, b) => Number(b.endTime - a.endTime)), // Sort by most recently finished
    [finishedProposalsResults]
  );

  const isAllProposalsFetching = 
    activeProposalsResults.some(r => r.isFetching) || 
    finishedProposalsResults.some(r => r.isFetching);


  return {
    hashBalance,
    hashAllowance,
    activeProposals,
    finishedProposals,
    isLoading: areQueriesLoading || isAllProposalsFetching,
    status,
    setStatus,
    createProposal,
    vote,
    claimReward,
    // getProposalAndUserStatus no longer returned directly, but used internally
    isCreatingProposalPending: creatingProposalPending,
    isVotingPending: useCallback((id: bigint) => votingPending.has(id), [votingPending]),
    isClaimingPending: useCallback((id: bigint) => claimingPending.has(id), [claimingPending]),
    hasOgNft,
    hasFarmNft,
  };
}