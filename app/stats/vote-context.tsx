"use client"

import { createContext, useContext, ReactNode } from 'react';
import { useVoteData } from '@/lib/data';

type VoteContextType = ReturnType<typeof useVoteData>;

const VoteContext = createContext<VoteContextType | null>(null);

export function VoteProvider({ children }: { children: ReactNode }) {
  const voteData = useVoteData();
  
  return (
    <VoteContext.Provider value={voteData}>
      {children}
    </VoteContext.Provider>
  );
}

export function useVoteContext() {
  const context = useContext(VoteContext);
  if (context === null) {
    throw new Error('useVoteContext must be used within a VoteProvider');
  }
  return context;
} 