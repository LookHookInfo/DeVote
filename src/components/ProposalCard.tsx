/// <reference types="react" />
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Spinner } from './Spinner';
import { Proposal, VoterType } from '../hooks/useDeVoteContract';
import { useActiveAccount } from 'thirdweb/react';
import { useResolvedName } from '../hooks/useResolvedName';
import { ProgressTimer } from './ProgressTimer';

export interface ProposalCardProps {
  prop: Proposal;
  account: ReturnType<typeof useActiveAccount>;
  isVotingPending: (id: bigint) => boolean;
  isClaimingPending: (id: bigint) => boolean;
  handleVote: (proposalId: bigint, voteType: 0 | 1 | 2) => Promise<void>;
  handleClaimReward: (proposalId: bigint) => Promise<void>;
  tokenSymbol: string;
  hasFarmNft: boolean;
  hasOgNft: boolean;
}

export function ProposalCard({
  prop,
  account,
  isVotingPending,
  isClaimingPending,
  handleVote,
  handleClaimReward,
  tokenSymbol,
  hasFarmNft,
  hasOgNft,
}: ProposalCardProps) {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const isVotingEnded = prop.endTime < now;
  const isClaimActive = isVotingEnded && now <= prop.claimEndTime;

  const { resolvedName: creatorName } = useResolvedName(prop.creator);

  const remainingPool = prop.rewardAmount - prop.claimedAmount;

  // Check eligibility
  const isEligibleToVote = prop.voterType === VoterType.FARM ? hasFarmNft : hasOgNft;
  const isVoteButtonDisabled = isVotingPending(prop.id) || !account || !isEligibleToVote || prop.hasUserVoted;

  const components = {
    p: ({ node, ...props }: any) => <p {...props} className="mb-3 last:mb-0 leading-relaxed whitespace-pre-wrap" />,
    ul: ({ node, ...props }: any) => <ul {...props} className="list-disc list-inside mb-3 space-y-1" />,
    ol: ({ node, ...props }: any) => <ol {...props} className="list-decimal list-inside mb-3 space-y-1" />,
    li: ({ node, ...props }: any) => <li {...props} className="ml-2" />,
    a: ({ node, ...props }: any) => <a {...props} className="text-[#a5c2ff] hover:underline font-medium" target="_blank" rel="noopener noreferrer" />,
    strong: ({ node, ...props }: any) => <strong {...props} className="text-white font-bold" />,
  };

  return (
    <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 flex flex-col justify-between relative overflow-hidden">
      {/* Voter Type Badge */}
      <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-lg ${
        prop.voterType === VoterType.OG 
          ? 'bg-[#cc7a00] text-white shadow-[0_0_15px_rgba(204,122,0,0.4)]' 
          : 'bg-[#a5c2ff] text-black'
      }`}>
        {prop.voterType === VoterType.OG ? '★ OG ONLY' : 'FARM ONLY'}
      </div>

      <div>
        <h3 className="text-xl font-bold text-white pr-16">{prop.title}</h3>
        <div className="text-neutral-400 text-sm mt-3 border-l-2 border-neutral-700 pl-4 py-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{prop.description}</ReactMarkdown>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <p className="text-neutral-300 text-sm font-medium flex items-center">
            <span className="mr-1">👤</span>By: {creatorName}
          </p>
          <span className="text-[10px] font-bold text-neutral-500 bg-neutral-900/50 px-2 py-0.5 rounded border border-neutral-700/50">
            #{prop.id.toString()}
          </span>
        </div>

        <div className="mt-4 mb-2">
          <ProgressTimer 
            startTime={prop.startTime} 
            endTime={prop.endTime} 
            claimEndTime={prop.claimEndTime} 
          />
        </div>

        <p className="text-neutral-400 text-sm mt-2">
          Reward: {(Number(prop.rewardAmount) / 10**18).toFixed(2)} {tokenSymbol} 
          <span className="ml-2 text-neutral-500">(Left: {(Number(remainingPool) / 10**18).toFixed(2)})</span>
        </p>

        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold mt-4 mb-4">
          <div className="bg-green-700/20 border border-green-700/30 text-green-400 py-1.5 rounded-md">
            FOR: {prop.forVotes}
          </div>
          <div className="bg-red-700/20 border border-red-700/30 text-red-400 py-1.5 rounded-md">
            AGAINST: {prop.againstVotes}
          </div>
          <div className="bg-gray-700/20 border border-gray-700/30 text-gray-400 py-1.5 rounded-md">
            ABSTAIN: {prop.abstainVotes}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        {!isVotingEnded ? (
           prop.hasUserVoted ? (
            <div className="bg-[#a5c2ff]/10 border border-[#a5c2ff]/20 text-[#a5c2ff] text-center py-2 rounded-lg font-bold text-sm">
              ✓ Voted
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVote(prop.id, 0)}
                  disabled={isVoteButtonDisabled}
                  className="flex-1 py-2 text-sm font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-30 transition-all"
                >
                  {isVotingPending(prop.id) ? <Spinner className="w-4 h-4 mx-auto" /> : 'For'}
                </button>
                <button
                  onClick={() => handleVote(prop.id, 1)}
                  disabled={isVoteButtonDisabled}
                  className="flex-1 py-2 text-sm font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-30 transition-all"
                >
                  {isVotingPending(prop.id) ? <Spinner className="w-4 h-4 mx-auto" /> : 'Against'}
                </button>
                <button
                  onClick={() => handleVote(prop.id, 2)}
                  disabled={isVoteButtonDisabled}
                  className="flex-1 py-2 text-sm font-bold rounded-lg bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-30 transition-all"
                >
                  {isVotingPending(prop.id) ? <Spinner className="w-4 h-4 mx-auto" /> : 'Abstain'}
                </button>
              </div>
              {!isEligibleToVote && account && (
                <p className="text-red-500 text-[10px] text-center font-medium">
                  Requirement: {prop.voterType === VoterType.OG ? 'OG NFT' : 'FARM NFT'}
                </p>
              )}
            </div>
          )
        ) : (
          <div className="space-y-3">
             {isClaimActive ? (
                prop.hasUserVoted && !prop.hasUserClaimed ? (
                  <button
                    onClick={() => handleClaimReward(prop.id)}
                    disabled={isClaimingPending(prop.id)}
                    className="w-full py-2.5 text-sm font-bold rounded-lg bg-[#a5c2ff] text-black hover:bg-[#8eafef] disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
                  >
                    {isClaimingPending(prop.id) ? <Spinner className="w-4 h-4 mx-auto" /> : `Claim ${(Number(prop.userRewardAmount) / 10**18).toFixed(2)} ${tokenSymbol}`}
                  </button>
                ) : (
                  <div className="text-center py-2 text-[#a5c2ff] font-bold text-sm bg-[#a5c2ff]/10 rounded-lg border border-[#a5c2ff]/20">
                    {prop.hasUserClaimed ? '✓ Reward Claimed' : 'Voting Ended'}
                  </div>
                )
             ) : (
                <div className="text-center py-2 text-[#a5c2ff]/60 font-bold text-sm bg-[#a5c2ff]/5 rounded-lg border border-[#a5c2ff]/10">
                  Archived
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}