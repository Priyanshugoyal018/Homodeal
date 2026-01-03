import React, { useEffect, useState } from 'react';

const GlobalLoader = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    async function registerLoader() {
      const { mirage } = await import('ldrs');
      mirage.register();
      setIsRegistered(true);
    }
    registerLoader();
  }, []);

  if (!isRegistered) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* @ts-ignore */}
      <l-mirage
        size="80"
        speed="2.5"
        color="#4F46E5" 
      ></l-mirage>
    </div>
  );
};

export default GlobalLoader;
