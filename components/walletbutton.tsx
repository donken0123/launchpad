'use client'
import {ConnectButton, useCurrentAccount, useDisconnectWallet,ConnectModal} from '@iota/dapp-kit';
import { useState } from 'react';



export default function WalletButton() {
  // 獲取當前連接的帳戶
  const account = useCurrentAccount();
  // 斷開錢包的 mutation
  const { mutate: disconnect } = useDisconnectWallet();
  const [open, setOpen] = useState(false);
  // --------------------------------------------
  // 🔗 已連接狀態：顯示地址和斷開按鈕
  // --------------------------------------------
  if (account) {
    // 截斷地址顯示
    const shortAddress = `${account.address.slice(0, 6)}...${account.address.slice(-4)}`;
    
    return (
      <div className="flex items-center gap-3">
        {/* 已連接標識 */}
        <div className="wallet-btn connected flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>{shortAddress}</span>
        </div>
        
        {/* 斷開按鈕 */}
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
        >
          斷開連接
        </button>
      </div>
    );
  }

  // --------------------------------------------
  // 🔌 未連接狀態：顯示連接按鈕
  // --------------------------------------------
  return (
    <ConnectButton
      connectText="連接錢包"
      className="wallet-btn"
    />
  );
}
