import React, { createContext, useContext, useState, useEffect } from 'react';
import { blockchainService, WalletInfo, Achievement } from '../services/blockchainService';

interface BlockchainContextType {
  isConnected: boolean;
  walletInfo: WalletInfo | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  mintAchievement: (achievement: Achievement) => Promise<string>;
  getStudentAchievements: (studentId: string) => Promise<Achievement[]>;
  verifyAchievement: (tokenId: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const info = await blockchainService.connectWallet();
      setWalletInfo(info);
      setIsConnected(true);
      
      // Save to localStorage for persistence
      localStorage.setItem('blockchain_connected', 'true');
      localStorage.setItem('wallet_address', info.address);
      
      console.log('🔗 Wallet connected successfully!', info);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('❌ Wallet connection failed:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await blockchainService.disconnect();
      setIsConnected(false);
      setWalletInfo(null);
      setError(null);
      
      // Clear localStorage
      localStorage.removeItem('blockchain_connected');
      localStorage.removeItem('wallet_address');
      
      console.log('🔌 Wallet disconnected');
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
    }
  };

  const mintAchievement = async (achievement: Achievement): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const tokenId = await blockchainService.mintAchievement(achievement);
      console.log('🎨 Achievement minted as NFT!', { tokenId, achievement });
      
      return tokenId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mint achievement';
      setError(errorMessage);
      console.error('❌ Achievement minting failed:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStudentAchievements = async (studentId: string): Promise<Achievement[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const achievements = await blockchainService.getStudentAchievements(studentId);
      console.log('📋 Fetched student achievements:', achievements);
      
      return achievements;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch achievements';
      setError(errorMessage);
      console.error('❌ Failed to fetch achievements:', errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const verifyAchievement = async (tokenId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const isValid = await blockchainService.verifyAchievement(tokenId);
      console.log('✅ Achievement verification result:', { tokenId, isValid });
      
      return isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify achievement';
      setError(errorMessage);
      console.error('❌ Achievement verification failed:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Check if wallet was previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('blockchain_connected');
    const walletAddress = localStorage.getItem('wallet_address');
    
    if (wasConnected && walletAddress && blockchainService.isConnected()) {
      setIsConnected(true);
      setWalletInfo({
        address: walletAddress,
        balance: '0',
        network: 'Polygon Mumbai',
        isConnected: true
      });
    }
  }, []);

  return (
    <BlockchainContext.Provider value={{
      isConnected,
      walletInfo,
      connectWallet,
      disconnectWallet,
      mintAchievement,
      getStudentAchievements,
      verifyAchievement,
      loading,
      error,
      clearError
    }}>
      {children}
    </BlockchainContext.Provider>
  );
};
