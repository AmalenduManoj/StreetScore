import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00a79d] via-[#008b7f] to-[#006b61] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white animate-spin"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold text-white">StreetScore</h2>
          <p className="text-white text-opacity-80 text-sm">Loading live updates...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
