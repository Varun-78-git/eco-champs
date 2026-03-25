import React, { useState } from 'react';
import type { RewardItem, User } from '../types';
import { REWARD_ITEMS_DATA } from '../constants';
import FingerprintConfirmationModal from './FingerprintConfirmationModal';

interface RewardsStoreProps {
  currentUser: User;
  onRedeem: (item: RewardItem) => void;
}

const RewardsStore: React.FC<RewardsStoreProps> = ({ currentUser, onRedeem }) => {
  const [itemToRedeem, setItemToRedeem] = useState<RewardItem | null>(null);

  const handleRedeemClick = (item: RewardItem) => {
    if (currentUser.points >= item.cost) {
      setItemToRedeem(item);
    }
  };

  const handleConfirmRedemption = () => {
    if (itemToRedeem) {
      onRedeem(itemToRedeem);
    }
    setItemToRedeem(null);
  };

  const handleCancelRedemption = (error?: string) => {
    if (error) {
      // For a better UX, you might use a toast notification library
      alert(`Redemption cancelled: ${error}`);
    }
    setItemToRedeem(null);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-text-primary">Eco-Rewards Store</h2>
              <p className="text-lg text-text-secondary mt-2">
                  Redeem your hard-earned Eco-Points for awesome rewards!
              </p>
              <p className="text-xl font-bold text-primary mt-4">Your Balance: {currentUser.points.toLocaleString()} Points</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {REWARD_ITEMS_DATA.map(item => {
                  const canAfford = currentUser.points >= item.cost;
                  return (
                      <div key={item.id} className="bg-surface rounded-2xl shadow-lg overflow-hidden flex flex-col">
                          <div className="bg-background h-40 flex items-center justify-center text-6xl">
                              {item.icon}
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                              <h3 className="text-xl font-bold text-text-primary">{item.name}</h3>
                              <p className="text-sm text-text-secondary mt-1 flex-1">{item.description}</p>
                              <div className="flex justify-between items-center mt-4">
                                  <p className="text-lg font-bold text-secondary">{item.cost.toLocaleString()} pts</p>
                                  <button
                                      onClick={() => handleRedeemClick(item)}
                                      disabled={!canAfford}
                                      className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                                  >
                                      Redeem
                                  </button>
                              </div>
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>
      {itemToRedeem && (
        <FingerprintConfirmationModal
            userId={currentUser.id}
            onConfirm={handleConfirmRedemption}
            onCancel={handleCancelRedemption}
        />
      )}
    </>
  );
};

export default RewardsStore;