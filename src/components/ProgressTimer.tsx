import React, { useState, useEffect } from 'react';

interface ProgressTimerProps {
  startTime: bigint;
  endTime: bigint;
  claimEndTime?: bigint; // Optional, for showing claim phase
}

const formatDateTime = (timestamp: bigint) => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
};

const formatTimeRemaining = (seconds: number) => {
  if (seconds <= 0) return "Ended";

  const days = Math.floor(seconds / (3600 * 24));
  seconds %= (3600 * 24);
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  if (parts.length === 0 && remainingSeconds > 0) parts.push(`${remainingSeconds}s`);
  else if (parts.length > 0 && days === 0 && hours === 0 && minutes === 0 && remainingSeconds > 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

export const ProgressTimer: React.FC<ProgressTimerProps> = ({ startTime, endTime, claimEndTime }) => {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalDuration = Number(endTime - startTime);
  const timeRemainingSeconds = Math.max(0, Number(endTime) - currentTime);
  
  // Calculate progress
  let progressPercentage = (timeRemainingSeconds / totalDuration) * 100;
  progressPercentage = Math.max(0, Math.min(100, progressPercentage));

  if (progressPercentage > 0 && progressPercentage < 5 && timeRemainingSeconds > 0) {
    progressPercentage = 5;
  }

  const isVotingEnded = currentTime > Number(endTime);
  const isClaimActive = claimEndTime && currentTime > Number(endTime) && currentTime <= Number(claimEndTime);
  const isAllEnded = claimEndTime && currentTime > Number(claimEndTime);

  const progressColor = isVotingEnded 
    ? (isClaimActive ? 'bg-orange-500' : 'bg-gray-500')
    : 'bg-[#a5c2ff]';

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative w-full h-5 bg-neutral-700 rounded-full overflow-hidden cursor-pointer group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${progressColor}`}
        style={{ width: `${progressPercentage}%` }}
      ></div>
      
      {showTooltip && (
        <div className="absolute z-10 p-2 text-xs text-white bg-gray-800 rounded-md shadow-lg -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-100 transition-opacity duration-300">
          Starts: {formatDateTime(startTime)} | Ends: {formatDateTime(endTime)}
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white px-2">
        {isVotingEnded ? (
           isClaimActive ? `Claiming Active (${formatTimeRemaining(Number(claimEndTime!) - currentTime)})` : "Archived"
        ) : (
          `${formatTimeRemaining(timeRemainingSeconds)} (${Math.round(progressPercentage)}%)`
        )}
      </div>
    </div>
  );
};
