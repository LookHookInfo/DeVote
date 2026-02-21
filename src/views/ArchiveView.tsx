import React from 'react';
import { useDeVoteContract } from '../hooks/useDeVoteContract';
import { Spinner } from '../components/Spinner';

export const ArchiveView: React.FC = () => {
  const { archivedProposals, isLoading } = useDeVoteContract();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner className="w-8 h-8 text-[#a5c2ff]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-10 min-h-screen">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-2 h-8 bg-[#a5c2ff] rounded-full"></div>
        <h1 className="text-3xl font-bold text-white">
          Governance <span className="text-[#a5c2ff]">Archive</span>
        </h1>
      </div>
      
      {archivedProposals.length === 0 ? (
        <p className="text-center text-neutral-400 py-20 bg-neutral-800/50 rounded-2xl border border-neutral-700">
          No proposals have been archived yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archivedProposals.map((prop) => (
            <div key={String(prop.id)} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 flex flex-col justify-between opacity-80 grayscale-[0.3] hover:grayscale-0 transition-all">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{prop.title}</h3>
                <p className="text-neutral-400 text-sm line-clamp-3">{prop.description}</p>
                
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold mt-6 mb-2">
                  <div className="bg-green-700/10 border border-green-700/20 text-green-500 py-1.5 rounded-md">
                    FOR: {prop.forVotes}
                  </div>
                  <div className="bg-red-700/10 border border-red-700/20 text-red-500 py-1.5 rounded-md">
                    AGAINST: {prop.againstVotes}
                  </div>
                  <div className="bg-gray-700/10 border border-gray-700/30 text-gray-500 py-1.5 rounded-md">
                    ABSTAIN: {prop.abstainVotes}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-neutral-700/50 flex justify-between items-center text-[10px] text-neutral-500 font-medium">
                <span>ID: {prop.id.toString()}</span>
                <span>Voters: {prop.voterCount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
