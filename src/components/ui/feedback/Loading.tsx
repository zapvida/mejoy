import React from 'react';

type LoadingProps = {
  message?: string;
};

const Loading = ({ message }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-black">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-purple-600 border-b-purple-600 border-l-white border-r-white" />
      {message && (
        <p className="text-sm text-white/70 text-center">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loading;