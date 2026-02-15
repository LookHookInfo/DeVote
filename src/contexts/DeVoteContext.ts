import { createContext, useContext } from 'react';
import { useDeVoteContract } from '../hooks/useDeVoteContract';

// The type for our context will be the return type of our hook
type DeVoteContextType = ReturnType<typeof useDeVoteContract> | null;

// Create the context with a default value of null
export const DeVoteContext = createContext<DeVoteContextType>(null);

// Custom hook to use the DeVoteContext
export const useDeVoteData = () => {
  const context = useContext(DeVoteContext);
  if (!context) {
    throw new Error('useDeVoteData must be used within a DeVoteProvider');
  }
  return context;
};
