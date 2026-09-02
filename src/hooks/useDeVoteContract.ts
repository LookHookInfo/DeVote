import { useState, useCallback, useMemo } from 'react';
import { useActiveAccount, useSendAndConfirmTransaction } from 'thirdweb/react';
import { prepareContractCall, readContract, toWei } from 'thirdweb';
import { devoteContract, hashcoinContract, ogNftContract, farmNftContract } from '../utils/contracts';
import { useQueries, useQueryClient, useQuery } from '@tanstack/react-query';

export enum VoterType { FARM = 0, OG = 1 }

export type Proposal = {
  id: bigint;
  rewardAmount: bigint;
  claimedAmount: bigint;
  startTime: bigint;
  endTime: bigint;
  claimEndTime: bigint;
  voterCount: number;
  forVotes: number;
  againstVotes: number;
  abstainVotes: number;
  voterType: VoterType;
  creator: string;
  title: string;
  description: string;
  // UI states
  hasUserVoted: boolean;
  hasUserClaimed: boolean;
  userRewardAmount: bigint;
};

export type DeVoteStatus = 'idle' | 'pending' | 'success' | 'error';

const createThirdwebQuery = ({
  contract,
  method,
  params = [],
  queryOptions = {},
}: {
  contract: any;
  method: string;
  params?: any[];
  queryOptions?: any;
}) => {
  const queryKey = [contract.chain.id, contract.address, method, params];
  return {
    queryKey,
    queryFn: () => readContract({ contract, method, params } as any),
    staleTime: 1000 * 60,
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

  const [creatingProposalPending, setCreatingProposalPending] = useState(false);
  const [votingPending, setVotingPending] = useState<Set<bigint>>(new Set());
  const [claimingPending, setClaimingPending] = useState<Set<bigint>>(new Set());
  const [refundingPending, setRefundingPending] = useState<Set<bigint>>(new Set());

  // 1. Core queries
  const baseQueries = useMemo(() => [
    createThirdwebQuery({
      contract: hashcoinContract,
      method: 'balanceOf',
      params: [accountAddress],
      queryOptions: { enabled: !!account?.address },
    }),
    createThirdwebQuery({
      contract: hashcoinContract,
      method: 'allowance',
      params: [accountAddress, devoteContract.address],
      queryOptions: { enabled: !!account?.address },
    }),
    createThirdwebQuery({
      contract: devoteContract,
      method: 'proposalCount',
      params: [],
    }),
    createThirdwebQuery({
      contract: ogNftContract,
      method: 'balanceOf',
      params: [accountAddress],
      queryOptions: { enabled: !!account?.address },
    }),
    createThirdwebQuery({
      contract: farmNftContract,
      method: 'balanceOf',
      params: [accountAddress],
      queryOptions: { enabled: !!account?.address },
    }),
  ], [account?.address, accountAddress]);

  const { data: hashBalance } = useQuery(baseQueries[0]);
  const { data: hashAllowance } = useQuery(baseQueries[1]);
  const { data: proposalCountBigInt } = useQuery(baseQueries[2]);
  const { data: ogNftBalance } = useQuery(baseQueries[3]);
  const { data: farmNftBalance } = useQuery(baseQueries[4]);

  const proposalCount = Number((proposalCountBigInt as bigint) || 0n);
  const hasOgNft = ((ogNftBalance as bigint) || 0n) > 0n;
  const hasFarmNft = ((farmNftBalance as bigint) || 0n) > 0n;

  const invalidateDevoteQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [devoteContract.chain.id, devoteContract.address] });
    queryClient.invalidateQueries({ queryKey: [hashcoinContract.chain.id, hashcoinContract.address] });
  }, [queryClient]);

  // 2. Fetch proposal details
  const getProposalDetails = useCallback(async (id: bigint): Promise<Proposal | null> => {
    try {
      const [p, hasVoted, hasClaimed] = await Promise.all([
        readContract({ contract: devoteContract, method: 'proposals', params: [id] } as any),
        account ? readContract({ contract: devoteContract, method: 'hasVoted', params: [id, account.address] } as any) : Promise.resolve(false),
        account ? readContract({ contract: devoteContract, method: 'hasClaimed', params: [id, account.address] } as any) : Promise.resolve(false),
      ]);

      const vc = p[5] as bigint;
      const voterCount = Number(vc >> 96n);
      const forVotes = Number((vc >> 64n) & 0xFFFFFFFFn);
      const againstVotes = Number((vc >> 32n) & 0xFFFFFFFFn);
      const abstainVotes = Number(vc & 0xFFFFFFFFn);

      return {
        id,
        rewardAmount: p[0] as bigint,
        claimedAmount: p[1] as bigint,
        startTime: p[2] as bigint,
        endTime: p[3] as bigint,
        claimEndTime: p[4] as bigint,
        voterCount,
        forVotes,
        againstVotes,
        abstainVotes,
        voterType: p[6] as VoterType,
        creator: p[7] as string,
        title: p[8] as string,
        description: p[9] as string,
        hasUserVoted: hasVoted as boolean,
        hasUserClaimed: hasClaimed as boolean,
        userRewardAmount: voterCount > 0 ? (p[0] as bigint) / BigInt(voterCount) : 0n,
      };
    } catch (e) {
      console.error(`Error fetching proposal ${id}:`, e);
      return null;
    }
  }, [account]);

  // 3. Multi-query for all proposals
  const proposalIds = useMemo(() => Array.from({ length: proposalCount }, (_, i) => BigInt(i + 1)), [proposalCount]);

  const proposalsResults = useQueries({
    queries: proposalIds.map(id => ({
      queryKey: ['proposal', id.toString(), accountAddress],
      queryFn: () => getProposalDetails(id),
      staleTime: 1000 * 30,
    }))
  });

  const allProposals = useMemo(() => 
    proposalsResults
      .map(res => res.data)
      .filter((p): p is Proposal => !!p)
      .sort((a, b) => Number(b.id - a.id)),
  [proposalsResults]);

  const now = BigInt(Math.floor(Date.now() / 1000));
  
  // LOGIC SPLIT:
  // 1. Voting phase (now < endTime)
  const activeProposals = useMemo(() => 
    allProposals.filter(p => now < p.endTime), 
  [allProposals, now]);

  // 2. Claiming phase (endTime <= now <= claimEndTime)
  const finishedProposals = useMemo(() => 
    allProposals.filter(p => now >= p.endTime && now <= p.claimEndTime),
  [allProposals, now]);

  // 3. Archived (now > claimEndTime)
  const archivedProposals = useMemo(() => 
    allProposals.filter(p => now > p.claimEndTime),
  [allProposals, now]);

  // Actions
  const createProposal = useCallback(async (title: string, description: string, rewardAmount: string, vType: VoterType) => {
    if (!account) throw new Error('Not connected');
    setCreatingProposalPending(true);
    setStatus('pending');
    try {
      const rewardWei = toWei(rewardAmount);
      const allowance = (hashAllowance as bigint) ?? 0n;
      if (allowance < rewardWei) {
        const approveTx = prepareContractCall({
          contract: hashcoinContract,
          method: 'approve',
          params: [devoteContract.address, rewardWei],
        } as any);
        await sendAndConfirm(approveTx);
        await queryClient.invalidateQueries({ queryKey: [hashcoinContract.chain.id, hashcoinContract.address, 'allowance'] });
      }
      const tx = prepareContractCall({
        contract: devoteContract,
        method: 'createProposal',
        params: [title, description, rewardWei, vType],
      } as any);
      await sendAndConfirm(tx);
      setStatus('success');
      invalidateDevoteQueries();
    } catch (err) {
      setStatus('error');
      console.error('Create Proposal Failed:', err);
      throw err;
    } finally {
      setCreatingProposalPending(false);
    }
  }, [account, sendAndConfirm, invalidateDevoteQueries, hashAllowance, queryClient]);

  const vote = useCallback(async (proposalId: bigint, voteType: 0 | 1 | 2) => {
    if (!account) throw new Error('Not connected');
    setVotingPending(prev => new Set(prev).add(proposalId));
    try {
      const tx = prepareContractCall({ contract: devoteContract, method: 'vote', params: [proposalId, voteType] } as any);
      await sendAndConfirm(tx);
      invalidateDevoteQueries();
    } finally {
      setVotingPending(prev => {
        const next = new Set(prev);
        next.delete(proposalId);
        return next;
      });
    }
  }, [account, sendAndConfirm, invalidateDevoteQueries]);

  const claimReward = useCallback(async (proposalId: bigint) => {
    if (!account) throw new Error('Not connected');
    setClaimingPending(prev => new Set(prev).add(proposalId));
    try {
      const tx = prepareContractCall({ contract: devoteContract, method: 'claimReward', params: [proposalId] } as any);
      await sendAndConfirm(tx);
      invalidateDevoteQueries();
    } finally {
      setClaimingPending(prev => {
        const next = new Set(prev);
        next.delete(proposalId);
        return next;
      });
    }
  }, [account, sendAndConfirm, invalidateDevoteQueries]);

  const refundToCreator = useCallback(async (proposalId: bigint) => {
    if (!account) throw new Error('Not connected');
    setRefundingPending(prev => new Set(prev).add(proposalId));
    try {
      const tx = prepareContractCall({ contract: devoteContract, method: 'refundToCreator', params: [proposalId] } as any);
      await sendAndConfirm(tx);
      invalidateDevoteQueries();
    } finally {
      setRefundingPending(prev => {
        const next = new Set(prev);
        next.delete(proposalId);
        return next;
      });
    }
  }, [account, sendAndConfirm, invalidateDevoteQueries]);

  return {
    hashBalance: hashBalance as bigint | undefined,
    hashAllowance: hashAllowance as bigint | undefined,
    activeProposals,
    finishedProposals,
    archivedProposals,
    isLoading: proposalsResults.some(r => r.isLoading),
    status,
    setStatus,
    createProposal,
    vote,
    claimReward,
    refundToCreator,
    isCreatingProposalPending: creatingProposalPending,
    isVotingPending: (id: bigint) => votingPending.has(id),
    isClaimingPending: (id: bigint) => claimingPending.has(id),
    isRefundingPending: (id: bigint) => refundingPending.has(id),
    hasOgNft,
    hasFarmNft,
    accountAddress: account?.address
  };
}