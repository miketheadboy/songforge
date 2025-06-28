
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="border-4 border-[var(--bg-tertiary)] border-t-4 border-t-[var(--accent-cyan)] rounded-full w-[30px] h-[30px] animate-spin mx-auto my-5"></div>
  );
};

export default Loader;
