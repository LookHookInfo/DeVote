import { useActiveAccount } from 'thirdweb/react';
import { FinishedProposalsList } from '../components/FinishedProposalsList';
import { useDeVoteData } from '../contexts/DeVoteContext';
import { Spinner } from '../components/Spinner';
import { useArchiver } from '../hooks/useArchiver'; // Import useArchiver

export default function Finished() {
  const account = useActiveAccount();
  const {
    finishedProposals: allFinishedProposals, // Rename to avoid conflict
    isLoading,
    vote,
    claimReward,
    isVotingPending,
    isClaimingPending,
    hasFarmNft,
  } = useDeVoteData(); // Use the context hook

  const { recentFinishedProposals } = useArchiver(allFinishedProposals); // Use archiver hook

  const handleVote = async (proposalId: bigint, voteType: 0 | 1 | 2) => {
    if (!account) {
      alert('Please connect your wallet.');
      return;
    }
    await vote(proposalId, voteType);
  };

  const handleClaimReward = async (proposalId: bigint) => {
    if (!account) {
      alert('Please connect your wallet.');
      return;
    }
    await claimReward(proposalId);
  };

  return (
    <div className="lg:col-span-8 mt-10 lg:mt-0">
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Spinner className="w-8 h-8 text-blue-500" />
        </div>
      ) : (
        <FinishedProposalsList
          finishedProposals={recentFinishedProposals} // Pass filtered proposals
          isLoading={isLoading}
          isVotingPending={isVotingPending}
          isClaimingPending={isClaimingPending}
          handleVote={handleVote}
          handleClaimReward={handleClaimReward}
          tokenSymbol="HASH"
          account={account}
          hasFarmNft={hasFarmNft}
        />
      )}
    </div>
  );
}
