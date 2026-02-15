import { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { Spinner } from './Spinner';

interface CreateProposalFormProps {
  hashBalance: bigint | undefined;
  isCreatingProposalPending: boolean;
  createProposal: (title: string, description: string, rewardAmount: string) => Promise<void>;
  status: 'idle' | 'pending' | 'success' | 'error';
  setStatus: (status: 'idle' | 'pending' | 'success' | 'error') => void;
  hasOgNft: boolean; // New prop for OG NFT status
}

export function CreateProposalForm({
  hashBalance,
  isCreatingProposalPending,
  createProposal,
  hasOgNft, // Destructure new prop
}: CreateProposalFormProps) {
  const account = useActiveAccount();
  const [newProposalTitle, setNewProposalTitle] = useState('');
  const [newProposalDescription, setNewProposalDescription] = useState('');
  const [newProposalReward, setNewProposalReward] = useState('');
  const [showTitleError, setShowTitleError] = useState(false);
  const [showDescriptionError, setShowDescriptionError] = useState(false);

  const TITLE_MAX_LENGTH = 100;
  const DESCRIPTION_MAX_LENGTH = 1000;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewProposalTitle(value);
    setShowTitleError(value.length > TITLE_MAX_LENGTH);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewProposalDescription(value);
    setShowDescriptionError(value.length > DESCRIPTION_MAX_LENGTH);
  };

  const handleCreateProposal = async () => {
    if (!account) {
      alert('Please connect your wallet.');
      return;
    }
    // Add check for hasOgNft here, even though the button is disabled, for double-safety
    if (!hasOgNft) {
      alert('You must hold an OG NFT to create proposals.');
      return;
    }
    if (showTitleError || showDescriptionError || !newProposalTitle || !newProposalDescription || !newProposalReward) {
      alert('Please correct the errors or fill all proposal fields.');
      return;
    }
    const reward = Number(newProposalReward);
    if (isNaN(reward) || reward <= 0) {
      alert('Reward amount must be a positive number.');
      return;
    }

    await createProposal(newProposalTitle, newProposalDescription, newProposalReward);
    setNewProposalTitle('');
    setNewProposalDescription('');
    setNewProposalReward('');
    setShowTitleError(false);
    setShowDescriptionError(false);
    // Removed setStatus('idle') to allow useDeVoteContract to manage the final status
  };

  const isButtonDisabled = isCreatingProposalPending || !account || !hasOgNft || !newProposalReward || Number(newProposalReward) <= 0 || showTitleError || showDescriptionError || newProposalTitle.length === 0 || newProposalDescription.length === 0;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-4">Create New Proposal</h2>
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 space-y-4">
        <div> {/* Wrapper div for input and count */}
          <input
            type="text"
            className={`w-full p-3 rounded-md bg-neutral-700 text-white border ${showTitleError ? 'border-red-500' : 'border-neutral-600'} focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Proposal Title"
            value={newProposalTitle}
            onChange={handleTitleChange}
          />
          <div className="text-xs mt-1 text-right">
            <span className={`${showTitleError ? 'text-red-500' : 'text-neutral-400'}`}>
              {newProposalTitle.length}/{TITLE_MAX_LENGTH}
            </span>
            {showTitleError && <p className="text-red-500">Title exceeds {TITLE_MAX_LENGTH} characters.</p>}
          </div>
        </div>

        <div> {/* Wrapper div for textarea and count */}
          <textarea
            className={`w-full p-3 rounded-md bg-neutral-700 text-white border ${showDescriptionError ? 'border-red-500' : 'border-neutral-600'} focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Proposal Description (max 1000 characters)"
            rows={5}
            value={newProposalDescription}
            onChange={handleDescriptionChange}
          ></textarea>
          <div className="text-xs mt-1 text-right">
            <span className={`${showDescriptionError ? 'text-red-500' : 'text-neutral-400'}`}>
              {newProposalDescription.length}/{DESCRIPTION_MAX_LENGTH}
            </span>
            {showDescriptionError && <p className="text-red-500">Description exceeds {DESCRIPTION_MAX_LENGTH} characters.</p>}
          </div>
        </div>

        <input
          type="number"
          className="w-full p-3 rounded-md bg-neutral-700 text-white border border-neutral-600 focus:ring-blue-500 focus:border-blue-500 no-spin-buttons"
          placeholder={`Reward HASH (your balance: ${hashBalance !== undefined ? (Number(hashBalance) / 10**18).toFixed(2) : '0.00'})`}
          value={newProposalReward}
          onChange={(e) => setNewProposalReward(e.target.value)}
          min="0"
        />
        <button
          onClick={handleCreateProposal}
          disabled={isButtonDisabled}
          className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isCreatingProposalPending ? <Spinner className="w-4 h-4 mr-2" /> : null}
          {isCreatingProposalPending ? 'Creating...' : 'Create Proposal'}
        </button>
        {!hasOgNft && account && ( // Display message if not OG NFT holder and connected
          <p className="text-red-500 text-sm mt-2">You must hold an OG NFT to create proposals.</p>
        )}
      </div>
    </div>
  );
}