import { useMemo } from 'react';
import { Proposal } from './useDeVoteContract';

const ARCHIVE_THRESHOLD_SECONDS = 10 * 24 * 60 * 60; // 10 days in seconds

export function useArchiver(allFinishedProposals: Proposal[]) {
  const { recentFinishedProposals, archivableProposals } = useMemo(() => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const recent: Proposal[] = [];
    const archivable: Proposal[] = [];

    for (const prop of allFinishedProposals) {
      const timeSinceEnd = nowInSeconds - Number(prop.endTime);
      if (timeSinceEnd >= ARCHIVE_THRESHOLD_SECONDS) {
        archivable.push(prop);
      } else {
        recent.push(prop);
      }
    }

    return {
      recentFinishedProposals: recent,
      archivableProposals: archivable,
    };
  }, [allFinishedProposals]);

  return { recentFinishedProposals, archivableProposals };
}
