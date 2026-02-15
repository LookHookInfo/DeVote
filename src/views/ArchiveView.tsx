import React from 'react';
import { useDeVoteData } from '../contexts/DeVoteContext';
import { useArchiver } from '../hooks/useArchiver';
import { Spinner } from '../components/Spinner';

export const ArchiveView: React.FC = () => {
  const { finishedProposals: allFinishedProposals, isLoading } = useDeVoteData();
  const { archivableProposals } = useArchiver(allFinishedProposals);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner className="w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Archived Proposals</h1>
      {archivableProposals.length === 0 ? (
        <p className="text-center text-neutral-400">No proposals have been archived yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {archivableProposals.map((prop) => (
            <div key={String(prop.id)} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h3 className="text-xl font-bold text-white">{prop.title}</h3>
              <p className="text-neutral-400 text-sm mb-2">{prop.description}</p>
              <div className="grid grid-cols-3 gap-2 text-center text-sm font-semibold mt-4">
                <span className="bg-green-700/30 text-green-400 py-1 px-2 rounded-md">For: {prop.forVotes.toString()}</span>
                <span className="bg-red-700/30 text-red-400 py-1 px-2 rounded-md">Against: {prop.againstVotes.toString()}</span>
                <span className="bg-gray-700/30 text-gray-400 py-1 px-2 rounded-md">Abstain: {prop.abstainVotes.toString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
