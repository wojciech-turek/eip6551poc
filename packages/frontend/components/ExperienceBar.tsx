import React from 'react';

const ExperienceBar = ({ currentExp }: { currentExp: number }) => {
  const percentage = (currentExp / 100) * 100;

  return (
    <div className="w-full relative h-4 rounded-md overflow-hidden bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400">
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-gray-700">
        {currentExp}/100
      </div>
      <div
        style={{ width: `${percentage}%` }}
        className="h-full bg-gradient-to-tr from-yellow-600 to-yellow-400 "
      ></div>
    </div>
  );
};

export default ExperienceBar;
