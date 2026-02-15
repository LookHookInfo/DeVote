import { Spinner } from './Spinner';
import { Proposal } from '../hooks/useDeVoteContract';
import { ProposalCard } from './ProposalCard'; // Assuming ProposalCard is in the same directory
import { useActiveAccount } from 'thirdweb/react'; // This import is needed for ReturnType below

interface FinishedProposalsListProps {
  finishedProposals: Proposal[] | undefined;
  isLoading: boolean;
  isVotingPending: (id: bigint) => boolean;
  isClaimingPending: (id: bigint) => boolean;
  handleVote: (proposalId: bigint, voteType: 0 | 1 | 2) => Promise<void>;
  handleClaimReward: (proposalId: bigint) => Promise<void>;
  tokenSymbol: string;
  account: ReturnType<typeof useActiveAccount>;
  hasFarmNft: boolean; // New prop for FARM NFT status
}

export function FinishedProposalsList({
  finishedProposals,
  isLoading,
  isVotingPending,
  isClaimingPending,
  handleVote,
  handleClaimReward,
  tokenSymbol,
  account,
  hasFarmNft, // Destructure new prop
}: FinishedProposalsListProps) {

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner className="w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-4">Finished Proposals ({finishedProposals?.length || 0})</h2>
      {(finishedProposals && finishedProposals.length > 0) ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {finishedProposals.map((prop) => (
            <ProposalCard
              key={prop.id.toString()}
              prop={prop}
              account={account}
              isVotingPending={isVotingPending}
              isClaimingPending={isClaimingPending}
              handleVote={handleVote}
              handleClaimReward={handleClaimReward}
              tokenSymbol={tokenSymbol}
              hasFarmNft={hasFarmNft} // Pass hasFarmNft to ProposalCard
            />
          ))}
        </div>
      ) : (
        <p className="text-neutral-400 text-center">No finished proposals found.</p>
      )}
    </div>
  );
}