/// <reference types="react" />
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Spinner } from './Spinner';
import { Proposal } from '../hooks/useDeVoteContract';
import { useActiveAccount } from 'thirdweb/react';
import { useResolvedName } from '../hooks/useResolvedName';
import { ProgressTimer } from './ProgressTimer'; // Import ProgressTimer

const DEFAULT_PROPOSAL_DURATION_SECONDS = 604800; // 7 days

export interface ProposalCardProps {
  prop: Proposal;
  account: ReturnType<typeof useActiveAccount>;
  isVotingPending: (id: bigint) => boolean;
  isClaimingPending: (id: bigint) => boolean;
  handleVote: (proposalId: bigint, voteType: 0 | 1 | 2) => Promise<void>;
  handleClaimReward: (proposalId: bigint) => Promise<void>;
  tokenSymbol: string;
  hasFarmNft: boolean;
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
}: ProposalCardProps) {
  const isVotingEnded = prop.endTime < BigInt(Math.floor(Date.now() / 1000));

  const { resolvedName: creatorName } = useResolvedName(prop.creator);

  const remainingPool = prop.rewardAmount - prop.claimedAmount;

  const isVoteButtonDisabled = isVotingPending(prop.id) || !account || !hasFarmNft || prop.hasUserVoted;

  const components = {
    a: ({ node, ...props }: any) => <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" />,
  };

  return (
    <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-white">{prop.title}</h3>
        <div className="text-neutral-400 text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{prop.description}</ReactMarkdown>
        </div>
        
        {/* Display creator with icon - moved and restyled */}
        <p className="text-neutral-300 text-sm font-medium flex items-center mt-2">
          <span className="mr-1">👤</span>By: {creatorName}
        </p>

        {/* Display end time with ProgressTimer */}
        <div className="mb-2">
          <ProgressTimer endTime={prop.endTime} initialDurationSeconds={DEFAULT_PROPOSAL_DURATION_SECONDS} />
        </div>

        
        {/* Display reward information - restyled and formatted */}
        <p className="text-neutral-400 text-sm mt-2">
          Reward: {(Number(prop.rewardAmount) / 10**18).toFixed(2)} {tokenSymbol} 
          (Remaining: {(Number(remainingPool) / 10**18).toFixed(2)} {tokenSymbol})
        </p>

        <div className="grid grid-cols-3 gap-2 text-center text-sm font-semibold mb-4">
          <span className="bg-green-700/30 text-green-400 py-1 px-2 rounded-md">For: {prop.forVotes.toString()}</span>
          <span className="bg-red-700/30 text-red-400 py-1 px-2 rounded-md">Against: {prop.againstVotes.toString()}</span>
          <span className="bg-gray-700/30 text-gray-400 py-1 px-2 rounded-md">Abstain: {prop.abstainVotes.toString()}</span>
        </div>
      </div>

      <div className="mt-auto">
        {isVotingEnded ? (
          <p className="text-center text-red-400 font-semibold">Voting Ended</p>
        ) : prop.hasUserVoted ? (
          <p className="text-center text-green-400 font-semibold">You have voted</p>
        ) : (
          <div className="flex flex-col space-y-2 mt-4">
            <div className="flex space-x-2">
              <button
                onClick={() => handleVote(prop.id, 0)}
                disabled={isVoteButtonDisabled}
                className="flex-1 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isVotingPending(prop.id) ? <Spinner className="w-4 h-4 mr-2" /> : null}
                For
              </button>
              <button
                onClick={() => handleVote(prop.id, 1)}
                disabled={isVoteButtonDisabled}
                className="flex-1 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isVotingPending(prop.id) ? <Spinner className="w-4 h-4 mr-2" /> : null}
                Against
              </button>
              <button
                onClick={() => handleVote(prop.id, 2)}
                disabled={isVoteButtonDisabled}
                className="flex-1 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isVotingPending(prop.id) ? <Spinner className="w-4 h-4 mr-2" /> : null}
                Abstain
              </button>
            </div>
            {!hasFarmNft && account && (
              <p className="text-red-500 text-sm text-center">You must hold a FARM NFT to vote.</p>
            )}
          </div>
        )}
        {isVotingEnded && prop.rewardAmount > 0n && prop.hasUserVoted && !prop.hasUserClaimed && account && (
            <button
              onClick={() => handleClaimReward(prop.id)}
              disabled={isClaimingPending(prop.id)}
              className="w-full mt-4 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-[#a5c2ff] text-white hover:bg-[#8eafef] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isClaimingPending(prop.id) ? <Spinner className="w-4 h-4 mr-2" /> : null}
              Claim {(Number(prop.userRewardAmount) / 10**18).toFixed(2)} {tokenSymbol}
            </button>
        )}
      </div>
    </div>
  );
}