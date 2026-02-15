import React, { useState, useEffect } from 'react';

interface ProgressTimerProps {
  endTime: bigint;
  initialDurationSeconds: number; // Added for fixed duration proposals
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
  // Only show seconds if less than a minute, or if it's the only remaining part
  if (parts.length === 0 && remainingSeconds > 0) parts.push(`${remainingSeconds}s`);
  else if (parts.length > 0 && days === 0 && hours === 0 && minutes === 0 && remainingSeconds > 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

export const ProgressTimer: React.FC<ProgressTimerProps> = ({ endTime, initialDurationSeconds }) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

    const endTimeMs = Number(endTime) * 1000;

  

    const timeRemainingMs = endTimeMs - currentTime;

    const timeRemainingSeconds = Math.max(0, Math.floor(timeRemainingMs / 1000));
  
  // Calculate progress relative to the total duration
  let progressPercentage = (timeRemainingSeconds / initialDurationSeconds) * 100;
  progressPercentage = Math.max(0, Math.min(100, progressPercentage)); // Ensure it's between 0 and 100

  // Aesthetic improvement: ensure minimum visibility for very small percentages remaining and time remaining > 0
  if (progressPercentage > 0 && progressPercentage < 5 && timeRemainingSeconds > 0) {
    progressPercentage = 5; // Ensure at least 5% is visible if time remains
  }


  const progressColor = timeRemainingSeconds <= 0
    ? 'bg-gray-500' // Ended
    : 'bg-[#a5c2ff]'; // Consistent with custom-blue brand color




  const displayPercentage = Math.round(progressPercentage);

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
      {/* Tooltip on hover */}
      {showTooltip && (
        <div className="absolute z-10 p-2 text-xs text-white bg-gray-800 rounded-md shadow-lg -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Ends: {formatDateTime(endTime)}
        </div>
      )}
      {/* Time remaining text inside the bar */}
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white px-2">
        {timeRemainingSeconds <= 0 ? (
          "Ended"
        ) : (
          `${formatTimeRemaining(timeRemainingSeconds)} (${displayPercentage}%)`
        )}
      </div>
    </div>
  );
};
