import { Spinner } from './Spinner';
import { Proposal } from '../hooks/useDeVoteContract';
import { ProposalCard } from './ProposalCard';
import { useActiveAccount } from 'thirdweb/react';

interface ProposalsListProps {
  title: string;
  proposals: Proposal[] | undefined;
  isLoading: boolean;
  isVotingPending: (id: bigint) => boolean;
  isClaimingPending: (id: bigint) => boolean;
  handleVote: (proposalId: bigint, voteType: 0 | 1 | 2) => Promise<void>;
  handleClaimReward: (proposalId: bigint) => Promise<void>;
  tokenSymbol: string;
  account: ReturnType<typeof useActiveAccount>;
  hasFarmNft: boolean;
  hasOgNft: boolean;
  emptyMessage?: string;
}

export function ProposalsList({
  title,
  proposals,
  isLoading,
  isVotingPending,
  isClaimingPending,
  handleVote,
  handleClaimReward,
  tokenSymbol,
  account,
  hasFarmNft,
  hasOgNft,
  emptyMessage = "No proposals found."
}: ProposalsListProps) {

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner className="w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-4">{title} ({proposals?.length || 0})</h2>
      {(proposals && proposals.length > 0) ? (
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {proposals.map((prop) => (
            <ProposalCard
              key={prop.id.toString()}
              prop={prop}
              account={account}
              isVotingPending={isVotingPending}
              isClaimingPending={isClaimingPending}
              handleVote={handleVote}
              handleClaimReward={handleClaimReward}
              tokenSymbol={tokenSymbol}
              hasFarmNft={hasFarmNft}
              hasOgNft={hasOgNft}
            />
          ))}
        </div>
      ) : (
        <p className="text-neutral-400 text-center mb-10">{emptyMessage}</p>
      )}
    </div>
  );
}