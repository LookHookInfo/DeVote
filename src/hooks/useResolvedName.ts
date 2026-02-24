import { useQuery } from '@tanstack/react-query';
import { useNameContract } from './useNameContract';
import { useCallback } from 'react';
import { readContract } from 'thirdweb';
import { communityRegistryContract } from '../utils/contracts';

// Helper to truncate address
const truncateAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function useResolvedName(address: string | undefined) {
  // Pass a dummy setStatus function as it's not used here
  const { resolveName } = useNameContract(() => {});

  const queryFn = useCallback(async () => {
    if (!address) {
      return null;
    }
    
    try {
      // Fetch name and profile in parallel
      const [name, profile] = await Promise.all([
        resolveName(address),
        readContract({
          contract: communityRegistryContract,
          method: "getProfile",
          params: [address],
        }).catch(err => {
          console.error(`Failed to fetch profile for ${address}:`, err);
          return null;
        })
      ]);

      // Extract avatarUrl carefully. Profile is a tuple: [avatarUrl, twitter, debank, linkedin]
      let avatarUrl = null;
      if (profile) {
        // Try both array and object access
        avatarUrl = (profile as any).avatarUrl || (Array.isArray(profile) ? profile[0] : null);
      }

      return {
        name,
        avatarUrl: avatarUrl && avatarUrl !== "" ? avatarUrl : null
      };
    } catch (e) {
      console.error("Error in useResolvedName queryFn:", e);
      return null;
    }
  }, [address, resolveName]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['resolvedName', address],
    queryFn: queryFn,
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    resolvedName: data?.name || (address ? truncateAddress(address) : null),
    avatarUrl: data?.avatarUrl || null,
    isLoading,
    error,
  };
}