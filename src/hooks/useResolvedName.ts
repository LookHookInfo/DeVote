import { useQuery } from '@tanstack/react-query';
import { useNameContract } from './useNameContract';
import { useCallback } from 'react';

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
    const name = await resolveName(address);
    return name;
  }, [address, resolveName]);

  const { data: resolvedName, isLoading, error } = useQuery({
    queryKey: ['resolvedName', address],
    queryFn: queryFn,
    // Only fetch if address is provided
    enabled: !!address,
    // Keep data fresh for a short period, then refetch on mount/focus
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Background refetching
    refetchOnWindowFocus: true,
  });

  return {
    resolvedName: resolvedName || (address ? truncateAddress(address) : null),
    isLoading,
    error,
  };
}